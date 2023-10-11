import { Static, Type } from '@sinclair/typebox';

export const UploadFileResultDto = Type.Object({
    status: Type.String(),
    message: Type.String()
});

export type UploadFileResultDto = Static<typeof UploadFileResultDto>;
