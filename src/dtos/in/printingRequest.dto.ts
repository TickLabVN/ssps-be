import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const PrintingRequestInputDto = Type.Object({
    userName: Type.String()
});

export type PrintingRequestInputDto = Static<typeof PrintingRequestInputDto>;
