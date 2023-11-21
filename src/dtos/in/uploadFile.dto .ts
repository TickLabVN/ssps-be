import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const UploadFileAndConfigInputDto = Type.Object({
    file: Type.String(),
    config: Type.String()
});

export const UploadFileParamsDto = Type.Object({
    printingRequestId: Type.String()
});

export const UploadFileBodyDto = Type.Object({
    file: Type.String(),
    fileName: Type.String()
});

export const UploadConfigParamsDto = Type.Object({
    fileId: Type.String()
});

export const UploadConfigBodyDto = Type.Object({
    numOfCopies: Type.Number(),
    layout: Type.String(),
    pages: Type.String(),
    pagesPerSheet: Type.String(),
    pageSide: Type.String()
});

export const FilePrintNumberChangeRequestBodyDto = Type.Array(
    Type.Object({
        fileId: Type.String(),
        numOfCopies: Type.Integer()
    })
);

export type UploadFileAndConfigInputDto = Static<typeof UploadFileAndConfigInputDto>;
export type UploadFileParamsDto = Static<typeof UploadFileParamsDto>;
export type UploadConfigParamsDto = Static<typeof UploadConfigParamsDto>;
export type UploadConfigBodyDto = Static<typeof UploadConfigBodyDto>;
export type FilePrintNumberChangeRequestBodyDto = Static<typeof FilePrintNumberChangeRequestBodyDto>;
