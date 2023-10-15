import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const PrintingFileInputDto = Type.Object({
    PrintingRequestId: Type.String()
});

export type PrintingFileInputDto = Static<typeof PrintingFileInputDto>;
