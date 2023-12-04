import { Static, Type } from '@sinclair/typebox';

export const UploadFileResultDto = Type.Object({
    fileId: Type.String(),
    fileName: Type.String(),
    numPage: Type.Number(),
    fileURL: Type.String(),
    fileSize: Type.Number(),
    fileCoin: Type.Number(),
    fileNum: Type.Number()
});

export const UploadConfigResultDto = Type.Object({
    status: Type.String(),
    fileId: Type.String()
});

export const FilePrintNumberChangeRequestResultDto = Type.Object({
    status: Type.String(),
    message: Type.Optional(Type.String()),
    fileId: Type.Optional(Type.String())
});

export type UploadFileResultDto = Static<typeof UploadFileResultDto>;
export type UploadConfigResultDto = Static<typeof UploadConfigResultDto>;
export type FilePrintNumberChangeRequestResultDto = Static<typeof FilePrintNumberChangeRequestResultDto>;
