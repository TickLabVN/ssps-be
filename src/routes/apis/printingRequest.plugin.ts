import { PrintingResultDto } from '@dtos/out';
import { printingRequestHandler } from '@handlers';
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
    }
]);
