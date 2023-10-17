import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const CreatePrintingRequestInputDto = Type.Object({
    userName: Type.String()
});

export const ExecutePrintingRequestInputDto = Type.Object({
    printingRequestId: Type.String()
});

export type CreatePrintingRequestInputDto = Static<typeof CreatePrintingRequestInputDto>;
export type ExecutePrintingRequestInputDto = Static<typeof ExecutePrintingRequestInputDto>;
