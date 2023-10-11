import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const PrintingRequestInputDto = Type.Object({
    userName: Type.String()
});

export const ExecutePrintingRequestInputDto = Type.Object({
    printingRequestId: Type.String()
});

export type ExecutePrintingRequestInputDto = Static<typeof ExecutePrintingRequestInputDto>;

export type PrintingRequestInputDto = Static<typeof PrintingRequestInputDto>;
