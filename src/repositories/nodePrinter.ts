import { Printer } from '@interfaces';
import printer, { PrinterDriverOptions } from '@thiagoelg/node-printer';
import { logger } from '@utils';

type SupportedPrintFormats = 'RAW' | 'TEXT' | 'PDF' | 'JPEG' | 'POSTSCRIPT' | 'COMMAND' | 'AUTO';

export const nodePrinter: Printer = {
    getSupportedPrintFormats: () => {
        return printer.getSupportedPrintFormats();
    },
    getPrinterDriverOptions: (printerName): PrinterDriverOptions => {
        return printer.getPrinterDriverOptions(printerName);
    },
    print: (buffer, fileType: SupportedPrintFormats, printerName?) => {
        return new Promise((resolve, reject) => {
            printer.printDirect({
                data: buffer,
                // printer: 'MF3010',
                // type: 'JPEG',
                printer: printerName,
                type: fileType,
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
