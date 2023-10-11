import { PRINTING_STATUS } from '@constants';
import { Static, Type } from '@sinclair/typebox';

export const PrintingResultDto = Type.Array(
    Type.Object({
        status: Type.String({ format: 'status' }),
        location: Type.String({ format: 'location' }),
        number: Type.Number({ format: 'number' }),
        fileName: Type.String({ format: 'fileName' }),
        pageNumber: Type.Number({ format: 'pageNumber' }),
        coins: Type.Number({ format: 'coins' }),
        paid: Type.String({ format: 'paid' })
    })
);

export const ExecutePrintingRequestResultDto = Type.Object({
    PrintingStatus: Type.Enum(PRINTING_STATUS)
});

export type PrintingResultDto = Static<typeof PrintingResultDto>;

export type ExecutePrintingRequestResultDto = Static<typeof ExecutePrintingRequestResultDto>;
