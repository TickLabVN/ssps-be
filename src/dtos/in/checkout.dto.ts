import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const CreatePayPalOrderDto = Type.Object(
    {
        intent: Type.String(),
        amount: Type.Number()
    },
    {
        examples: [
            {
                intent: 'CAPTURE',
                amount: 1
            }
        ]
    }
);

export const CompletePayPalOrderDto = Type.Object(
    {
        intent: Type.String(),
        orderId: Type.String()
    },
    {
        examples: [
            {
                intent: 'CAPTURE',
                orderId: 'Order_id_is_in_result_of_create_order_api'
            }
        ]
    }
);

export type CreatePayPalOrderDto = Static<typeof CreatePayPalOrderDto>;
export type CompletePayPalOrderDto = Static<typeof CompletePayPalOrderDto>;
