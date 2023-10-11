import { Static, Type } from '@sinclair/typebox';

export const PrintingFileResultDto = Type.Object({
    status: Type.String()
});

export type PrintingFileResultDto = Static<typeof PrintingFileResultDto>;
