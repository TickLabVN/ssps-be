import { PRINTING_CONFIGS } from '@configs';

type PrintingConfigs = {
    [K in (typeof PRINTING_CONFIGS)[number]]: string;
};
