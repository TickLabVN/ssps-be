import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const CreatePrintingRequestInputDto = Type.Object({
    userName: Type.String()
});

export const PrintingRequestInputDto = Type.Object({
    printingRequestId: Type.String()
});

export const FilePrintingRequestInputDto = Type.Object({
    fileId: Type.String()
});

export const DeleteFilePrintingRequestInputDto = Type.Object({
    fileId: Type.String()
});

export type CreatePrintingRequestInputDto = Static<typeof CreatePrintingRequestInputDto>;
export type PrintingRequestInputDto = Static<typeof PrintingRequestInputDto>;
export type FilePrintingRequestInputDto = Static<typeof FilePrintingRequestInputDto>;
export type DeleteFilePrintingRequestInputDto = Static<typeof DeleteFilePrintingRequestInputDto>;
