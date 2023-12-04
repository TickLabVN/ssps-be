import { Static, Type } from '@sinclair/typebox';

export const PrintingFileResultDto = Type.Object({
    status: Type.String(),
    message: Type.String(),
    printingRequestId: Type.String()
});

export type PrintingFileResultDto = Static<typeof PrintingFileResultDto>;
