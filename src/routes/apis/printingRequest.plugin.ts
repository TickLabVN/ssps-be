import { DeleteFilePrintingRequestInputDto, FilePrintingRequestInputDto, PrintingRequestInputDto } from '@dtos/in';
import {
    PrintingFileResultDto,
    GetPrintingRequestResultDto,
    UploadFileResultDto,
    CreatePrintingRequestResultDto,
    DeleteFilePrintingRequestResultDto,
    AllFilesPrintingRequestResultDto
} from '@dtos/out';
import { printingRequestHandler } from '@handlers';
import { createRoutes } from '@utils';

export const printingRequestPlugin = createRoutes('Printing Request', [
    {
        method: 'GET',
        url: '',
        roles: ['*'],
        schema: {
            summary: 'Get all printing request of current user',
            response: {
                200: GetPrintingRequestResultDto
            }
        },
        handler: printingRequestHandler.getAllPrintingRequest
    },
    {
        method: 'POST',
        url: '',
        roles: ['*'],
        schema: {
            summary: 'Create printing request',
            response: {
                200: CreatePrintingRequestResultDto
            }
        },
        handler: printingRequestHandler.createPrintingRequest
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
        handler: printingRequestHandler.uploadFileToPrintingRequest
    },
    {
        method: 'GET',
        roles: ['*'],
        url: '/:printingRequestId/files',
        schema: {
            summary: 'Get all files of printing request',
            params: PrintingRequestInputDto,
            response: {
                200: AllFilesPrintingRequestResultDto
            }
        },
        handler: printingRequestHandler.getAllFilesPrintingRequest
    },
    {
        method: 'GET',
        roles: ['*'],
        url: '/:printingRequestId/file/:fileId',
        schema: {
            summary: 'Get the specific files of printing request',
            params: FilePrintingRequestInputDto,
            response: {
                200: AllFilesPrintingRequestResultDto
            }
        },
        handler: printingRequestHandler.getAllFilesPrintingRequest
    },
    {
        method: 'DELETE',
        roles: ['*'],
        url: '/:printingRequestId/file',
        schema: {
            summary: 'Delete the specific file of printing request',
            params: PrintingRequestInputDto,
            body: DeleteFilePrintingRequestInputDto,
            response: {
                200: DeleteFilePrintingRequestResultDto
            }
        },
        handler: printingRequestHandler.deleteFilePrintingRequest
    },
    {
        method: 'POST',
        url: '/execute',
        roles: ['*'],
        schema: {
            summary: 'Execute printing request',
            body: PrintingRequestInputDto,
            response: {
                200: PrintingFileResultDto
            }
        },
        handler: printingRequestHandler.executePrintingRequest
    }
]);
