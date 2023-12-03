import {
    DeleteFilePrintingRequestInputDto,
    FilePrintAmountChangeRequestBodyDto,
    FilePrintingRequestInputDto,
    MultiFilePrintAmountChangeRequestBodyDto,
    PrintingRequestInputDto,
    UploadConfigBodyDto,
    UploadConfigParamsDto,
    UploadFileParamsDto
} from '@dtos/in';
import {
    PrintingFileResultDto,
    GetPrintingRequestResultDto,
    UploadFileResultDto,
    CreatePrintingRequestResultDto,
    DeleteFilePrintingRequestResultDto,
    AllFilesPrintingRequestResultDto,
    UploadConfigResultDto,
    FilePrintNumberChangeRequestResultDto,
    CancelPrintingRequestResultDto
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
        method: 'GET',
        roles: ['*'],
        url: '/:printingRequestId/file/:fileId',
        schema: {
            summary: 'Get the specific files of printing request',
            params: FilePrintingRequestInputDto,
            response: {
                200: AllFilesPrintingRequestResultDto
            },
            deprecated: true
        },
        handler: printingRequestHandler.getAllFilesPrintingRequest
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
    },
    {
        method: 'POST',
        url: '/uploadConfig/:fileId',
        roles: ['*'],
        schema: {
            summary: 'Upload config to specific file',
            params: UploadConfigParamsDto,
            body: UploadConfigBodyDto,
            response: {
                200: UploadConfigResultDto
            }
        },
        handler: printingRequestHandler.uploadConfigToPrintingRequest
    },
    {
        method: 'POST',
        url: '/:printingRequestId/uploadFile',
        roles: ['*'],
        schema: {
            summary: 'Upload file to printing request',
            consumes: ['multipart/form-data'],
            params: UploadFileParamsDto,
            body: {
                type: 'object',
                required: ['file'],
                properties: {
                    file: { isFile: true }
                }
            },
            response: {
                200: UploadFileResultDto
            }
        },
        handler: printingRequestHandler.uploadFileToPrintingRequest
    },
    {
        method: 'PATCH',
        url: '/printAmounts',
        roles: ['*'],
        schema: {
            summary: 'Change the amount of prints for multiple files',
            body: MultiFilePrintAmountChangeRequestBodyDto,
            response: {
                200: FilePrintNumberChangeRequestResultDto
            }
        },
        handler: printingRequestHandler.mutilFilePrintNumberChangeRequest
    },
    {
        method: 'PATCH',
        url: '/printAmount',
        roles: ['*'],
        schema: {
            summary: 'Change the amount of prints for single files',
            body: FilePrintAmountChangeRequestBodyDto,
            response: {
                200: FilePrintNumberChangeRequestResultDto
            }
        },
        handler: printingRequestHandler.filePrintNumberChangeRequest
    },
    {
        method: 'PATCH',
        url: '/:printingRequestId',
        roles: ['*'],
        schema: {
            summary: 'Cancel printing request',
            params: PrintingRequestInputDto,
            response: {
                200: CancelPrintingRequestResultDto
            }
        },
        handler: printingRequestHandler.cancelPrintingRequest
    },
    {
        method: 'DELETE',
        roles: ['*'],
        url: '/file/:fileId',
        schema: {
            summary: 'Delete the specific file of printing request',
            params: DeleteFilePrintingRequestInputDto,
            response: {
                200: DeleteFilePrintingRequestResultDto
            }
        },
        handler: printingRequestHandler.deleteFilePrintingRequest
    }
]);
