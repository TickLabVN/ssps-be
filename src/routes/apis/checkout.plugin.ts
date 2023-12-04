import { CompletePayPalOrderDto, CreatePayPalOrderDto } from '@dtos/in';
import { CompletePaypalDto, PaypalDto } from '@dtos/out';
import { coinHandler } from '@handlers';
import { createRoutes } from '@utils';

export const coinPlugin = createRoutes('Buy coin', [
    {
        method: 'POST',
        url: '/paypal/completing',
        roles: ['*'],
        schema: {
            summary: 'Complete PayPal Order to buy more coin',
            body: CompletePayPalOrderDto,
            response: {
                200: CompletePaypalDto
            }
        },
        handler: coinHandler.completePayPalOrder
    },
    {
        method: 'POST',
        url: '/paypal/creating',
        roles: ['*'],
        schema: {
            summary: 'Create PayPal Order to buy more coin',
            description:
                'Create PayPal Order to buy more coin, the unit of amount is vnd, the system will convert to apporiate currency base on amount vnd',
            body: CreatePayPalOrderDto,
            response: {
                200: PaypalDto
            }
        },
        handler: coinHandler.createPayPalOrder
    }
]);
