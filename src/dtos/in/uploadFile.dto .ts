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
    layout: Type.Union([Type.Literal('portrait'), Type.Literal('landscape')]),
    pages: Type.Union([Type.Literal('all'), Type.Literal('odd'), Type.Literal('even'), Type.Array(Type.String())]),
    pagesPerSheet: Type.Union([
        Type.Literal('1'),
        Type.Literal('2'),
        Type.Literal('4'),
        Type.Literal('6'),
        Type.Literal('9'),
        Type.Literal('16')
    ]),
    pageSide: Type.Union([Type.Literal('one'), Type.Literal('long'), Type.Literal('short')])
});

export const FilePrintAmountChangeRequestBodyDto = Type.Object({
    fileId: Type.String(),
    numOfCopies: Type.Integer()
});

export const MultiFilePrintAmountChangeRequestBodyDto = Type.Array(
    Type.Object({
        fileId: Type.String(),
        numOfCopies: Type.Integer()
    })
);

export type UploadFileAndConfigInputDto = Static<typeof UploadFileAndConfigInputDto>;
export type UploadFileParamsDto = Static<typeof UploadFileParamsDto>;
export type UploadConfigParamsDto = Static<typeof UploadConfigParamsDto>;
export type UploadConfigBodyDto = Static<typeof UploadConfigBodyDto>;
export type FilePrintAmountChangeRequestBodyDto = Static<typeof FilePrintAmountChangeRequestBodyDto>;
export type MultiFilePrintAmountChangeRequestBodyDto = Static<typeof MultiFilePrintAmountChangeRequestBodyDto>;
