import { PRINTING_STATUS } from '@constants';
import { Static, Type } from '@sinclair/typebox';

export const GetPrintingRequestResultDto = Type.Array(
    Type.Object({
        status: Type.String({ format: 'status' }),
        location: Type.String({ format: 'location' }),
        number: Type.Number({ format: 'number' }),
        filesName: Type.Array(Type.String({ format: 'fileName' })),
        pageNumber: Type.Number({ format: 'pageNumber' }),
        coins: Type.Number({ format: 'coins' }),
        paid: Type.String({ format: 'paid' })
    })
);

export const CreatePrintingRequestResultDto = Type.Object({
    id: Type.String()
});

export const AllFilesPrintingRequestResultDto = Type.Array(
    Type.Object({
        id: Type.String(),
        fileName: Type.String()
    })
);

export const DeleteFilePrintingRequestResultDto = Type.Object({
    status: Type.String(),
    fileId: Type.String(),
    message: Type.String()
});

export const ExecutePrintingRequestResultDto = Type.Object({
    PrintingStatus: Type.Enum(PRINTING_STATUS)
});

export type GetPrintingRequestResultDto = Static<typeof GetPrintingRequestResultDto>;

export type CreatePrintingRequestResultDto = Static<typeof CreatePrintingRequestResultDto>;

export type AllFilesPrintingRequestResultDto = Static<typeof AllFilesPrintingRequestResultDto>;

export type DeleteFilePrintingRequestResultDto = Static<typeof DeleteFilePrintingRequestResultDto>;

export type ExecutePrintingRequestResultDto = Static<typeof ExecutePrintingRequestResultDto>;
