import { envs } from '@configs';
import { MAX_INSERT_DB_RETRIES, DB_RETRY_DELAY_MS } from '@constants';
import { CompletePayPalOrderDto, CreatePayPalOrderDto } from '@dtos/in';
import { CompletePaypalDto, PaypalDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { paypalService } from '@services';
import { convertUSDtoVND, convertVNDtoUSD, logger } from '@utils';
import { DBConfiguration } from './getConfigurationInDb.handler';

async function getPayPalAccessToken() {
    const auth = `${envs.PAYPAL_CLIENT_ID}:${envs.PAYPAL_CLIENT_SECRET}`;
    const tokenResponse = await paypalService.getAccessToken(`Basic ${Buffer.from(auth).toString('base64')}`);
    return tokenResponse.access_token;
}

async function calculateTotalCoins(amountVnd: number) {
    const coinToVnd = await DBConfiguration.coinToVnd();
    const amountCoins = amountVnd / coinToVnd;

    const bonusCoinPer100000Vnd = await DBConfiguration.bonusCoinPer100000Vnd();
    const bonusCoin = Math.floor(amountVnd / 100000) * bonusCoinPer100000Vnd;

    return amountCoins + bonusCoin;
}

const createPayPalOrder: Handler<PaypalDto, { Body: CreatePayPalOrderDto }> = async (req, res) => {
    try {
        const accessToken = await getPayPalAccessToken();

        const amountVnd = req.body.amount;
        const amountDollar = await convertVNDtoUSD(amountVnd);

        const totalCoin = await calculateTotalCoins(amountVnd);

        const orderDataJson = {
            intent: req.body.intent.toUpperCase(),
            purchase_units: [
                {
                    item: {
                        name: 'coin',
                        quantity: `${totalCoin}`
                    },
                    amount: {
                        currency_code: 'USD',
                        value: amountDollar.toString()
                    }
                }
            ]
        };
        const data = JSON.stringify(orderDataJson);

        const createOrderResponse = await paypalService.createOrder(`Bearer ${accessToken}`, data);

        const orderId = createOrderResponse.id;

        return res.send({ id: orderId });
    } catch (err) {
        logger.error(err);
        res.internalServerError();
    }
};

const completePayPalOrder: Handler<CompletePaypalDto, { Body: CompletePayPalOrderDto }> = async (req, res) => {
    try {
        const accessToken = await getPayPalAccessToken();

        const completeOrderResponse = await paypalService.completeOrder(
            `Bearer ${accessToken}`,
            req.body.orderId,
            req.body.intent.toLowerCase()
        );

        const amountUSD = Number(
            completeOrderResponse.purchase_units ? completeOrderResponse.purchase_units[0].payments.captures[0].amount.value : 0
        );

        const amountVND = await convertUSDtoVND(amountUSD);

        const totalCoin = await calculateTotalCoins(amountVND);

        if (completeOrderResponse.status === 'COMPLETED') {
            let retries = 0;
            let updateSuccess = false;
            while (retries < MAX_INSERT_DB_RETRIES && !updateSuccess) {
                try {
                    await prisma.student.update({
                        where: { id: req.userId },
                        data: {
                            remain_coin: {
                                increment: totalCoin
                            }
                        }
                    });
                    updateSuccess = true;
                } catch (updateError) {
                    logger.error(`Database update attempt ${++retries} failed: ${updateError}`);
                    await new Promise((resolve) => setTimeout(resolve, DB_RETRY_DELAY_MS));
                }
            }

            if (!updateSuccess) {
                throw new Error('Failed to update database after multiple retry attempts.');
            }
        }

        return res.send({ id: completeOrderResponse.id, numCoin: totalCoin });
    } catch (err) {
        logger.error(err);
        res.internalServerError();
    }
};

export const coinHandler = {
    createPayPalOrder,
    completePayPalOrder
};
