import { invoke, openExchangeRatesServer } from './common';

export const currencyExchangeRateService = {
    getVietNameseExchangeRate: (apiKey: string) => {
        return invoke<Record<string, Record<string, string | number>>>(openExchangeRatesServer.get(`/v6/latest/VND?apikey=${apiKey}`));
    }
};
