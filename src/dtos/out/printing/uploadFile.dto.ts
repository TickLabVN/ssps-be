import { Static, Type } from '@sinclair/typebox';

export const UploadFileResultDto = Type.Object({
    fileId: Type.String(),
    fileName: Type.String(),
    numPage: Type.String(),
    fileURL: Type.String(),
    fileSize: Type.Number(),
    fileCoin: Type.Number()
});

export const UploadConfigResultDto = Type.Object({
    status: Type.String()
});

export type UploadFileResultDto = Static<typeof UploadFileResultDto>;
export type UploadConfigResultDto = Static<typeof UploadConfigResultDto>;
