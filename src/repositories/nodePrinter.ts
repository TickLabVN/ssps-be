import { Printer } from '@interfaces';
import printer from '@thiagoelg/node-printer';
import { logger } from '@utils';

export const nodePrinter: Printer = {
    print: (buffer: Buffer) => {
        return new Promise((resolve, reject) => {
            printer.printDirect({
                data: buffer,
                printer: 'PDF',
                type: 'JPEG',
                success: (jobID) => {
                    resolve(jobID);
                },
                error: (err) => {
                    logger.error(err);
                    reject(new Error(`Failed to print: ${err}`));
                }
            });
        });
    }
};
