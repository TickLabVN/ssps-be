import { CompletePayPalOrderDto, CreatePayPalOrderDto } from '@dtos/in';
import { CompletePaypalDto, PaypalDto } from '@dtos/out';
import { coinHandler } from '@handlers';
import { createRoutes } from '@utils';

export const coinPlugin = createRoutes('Buy coin', [
    {
        method: 'POST',
        url: '/paypal/creating',
        roles: ['*'],
        schema: {
            summary: 'Create PayPal Order to buy more coin',
            body: CreatePayPalOrderDto,
            response: {
                200: PaypalDto
            }
        },
        handler: coinHandler.createPayPalOrder
    },
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
    }
]);
