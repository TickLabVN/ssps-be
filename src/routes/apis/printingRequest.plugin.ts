import { PrintingResultDto } from '@dtos/out';
import { printingRequestHandler } from '@handlers';
import { createRoutes } from '@utils';

export const printingRequestPlugin = createRoutes('Printing Request', [
    {
        method: 'GET',
        url: '',
        roles: ['*'],
        schema: {
            summary: 'Get printing request of specific user',
            response: {
                200: PrintingResultDto
            }
        },
        handler: printingRequestHandler.getAllPrintingRequest
    }
]);
