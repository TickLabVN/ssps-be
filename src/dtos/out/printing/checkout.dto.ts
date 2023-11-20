import { Static, Type } from '@sinclair/typebox';

export const PaypalDto = Type.Object({
    id: Type.String()
});

export const CompletePaypalDto = Type.Object({
    id: Type.String(),
    numCoin: Type.Number()
});

export type PaypalDto = Static<typeof PaypalDto>;
export type CompletePaypalDto = Static<typeof CompletePaypalDto>;
