import { PrintingFileInputDto } from '@dtos/in';
import { PrintingFileResultDto, PrintingResultDto, UploadFileResultDto } from '@dtos/out';
import { printingRequestHandler, printingFileHandler, uploadFileHandler } from '@handlers';
import { createRoutes } from '@utils';

export const printingRequestPlugin = createRoutes('Printing Request', [
    {
        method: 'GET',
        url: '',
        roles: ['*'],
        schema: {
            summary: 'Get printing request list of current user',
            response: {
                200: PrintingResultDto
            }
        },
        handler: printingRequestHandler.getAllPrintingRequest
    },
    {
        method: 'POST',
        url: '/upload',
        roles: ['*'],
        schema: {
            summary: 'Upload file to printing request',
            consumes: ['multipart/form-data'],
            response: {
                200: UploadFileResultDto
            }
        },
        handler: uploadFileHandler.uploadFileToPrintingRequest
    },
    {
        method: 'POST',
        url: '/execute',
        roles: ['*'],
        schema: {
            summary: 'Execute printing request',
            body: PrintingFileInputDto,
            response: {
                200: PrintingFileResultDto
            }
        },
        handler: printingFileHandler.executePrintingRequest
    }
]);
