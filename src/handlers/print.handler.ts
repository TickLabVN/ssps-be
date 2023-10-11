import { PrintingFileInputDto } from '@dtos/in';
import { PrintingFileResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { logger, minio } from '@utils';
import { ThermalPrinter, PrinterTypes } from 'node-thermal-printer';

const printFileFromBuffer = async (fileBuffer: Buffer) => {
    const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: 'Virtual_Braille_BRF_Printerjkfasjdfjasdfjas;l'
    });

    const isPrinterConnected = await printer.isPrinterConnected();

    if (!isPrinterConnected) throw Error("Can't not connect to printer");

    logger.info(`printer connect: ${isPrinterConnected}`);

    try {
        await printer.raw(fileBuffer);

        printer.cut();

        printer.execute();
        logger.info('everything work well');
    } catch (error) {
        logger.error(error);
    } finally {
    }
};

const printFile: Handler<PrintingFileResultDto, { Body: PrintingFileInputDto }> = async (req, res) => {
    const fileName = `${req.userId}/${req.body.fileName}`;

    const buffer = await minio.getFileFromMinio(fileName);

    await printFileFromBuffer(buffer);

    return res.status(200).send('is printing');
};

export const printingFileHandler = {
    printFile
};
