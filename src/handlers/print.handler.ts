import { PrintingFileInputDto } from '@dtos/in';
import { PrintingFileResultDto } from '@dtos/out';
import { Handler, Printer } from '@interfaces';
import { nodePrinter, prisma } from '@repositories';
import { minio } from '@utils';

const printFileFromBuffer = async (printer: Printer, fileBuffer: Buffer) => {
    try {
        await printer.print(fileBuffer);
    } catch (err) {
        throw err;
    }
};

const getFilesForPrintingRequest = async (printingRequestId: string) => {
    const files = await prisma.file.findMany({
        where: {
            printingRequestId
        },
        select: {
            minioName: true,
            realName: true
        }
    });
    return files;
};

const executePrintingRequest: Handler<PrintingFileResultDto, { Body: PrintingFileInputDto }> = async (req, res) => {
    try {
        const filesOfPrintingRequest = await getFilesForPrintingRequest(req.body.PrintingRequestId);

        filesOfPrintingRequest.forEach(async (file) => {
            const buffer = await minio.getFileFromMinio(file.minioName);

            await printFileFromBuffer(nodePrinter, buffer);

            return res.status(200).send({ status: 'success', message: 'happy day' });
        });
    } catch (err) {
        return res.status(500).send({ status: 'fail', message: 'happy day' });
    }
};

export const printingFileHandler = {
    executePrintingRequest: executePrintingRequest
};
