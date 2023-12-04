import { envs } from '@configs';
import { currencyExchangeRateService } from '@services';

export async function convertVNDtoUSD(amountInVND: number): Promise<number> {
    const targetCurrency = 'USD';

    try {
        const currencyExchangeRates = await currencyExchangeRateService.getVietNameseExchangeRate(envs.OPEN_EXCHANGE_RATES_APP_ID);

        const exchangeRate = currencyExchangeRates.rates[targetCurrency];
        const amountInUSD = amountInVND * Number(exchangeRate) * 1.0;
        return amountInUSD;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw new Error('An error occurred while processing the conversion');
    }
}
