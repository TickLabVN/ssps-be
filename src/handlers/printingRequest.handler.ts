import { nodePrinter, prisma } from '@repositories';
import {
    AllFilesPrintingRequestResultDto,
    CreatePrintingRequestResultDto,
    DeleteFilePrintingRequestResultDto,
    GetPrintingRequestResultDto,
    PrintingFileResultDto,
    UploadFileResultDto
} from '@dtos/out';
import { Handler, Printer } from '@interfaces';
import { PAID, PRINTING_STATUS } from '@constants';
import { logger, minio } from '@utils';
import { PrintingRequestInputDto, UploadFileInputDto } from '@dtos/in';
import { PRINTING_CONFIGS } from '@configs';
import { PrintingConfigs } from 'src/types/printing';
import { File } from '@prisma/client';

const getAllPrintingRequest: Handler<GetPrintingRequestResultDto> = async (req) => {
    const userId = req.userId;

    const printingRequests = await prisma.printingRequest.findMany({
        select: {
            id: true,
            status: true,
            location: { select: { address: true } },
            number: true,
            pageNumber: true,
            coins: true,
            paid: true,
            files: { select: { realName: true } }
        },
        where: {
            userId: {
                equals: userId
            }
        }
    });

    const formattedPrintingRequests = printingRequests.map((request) => {
        const { status, files, paid, location, ...remain } = request;
        const formatStatus = PRINTING_STATUS[status];

        const formatFiles = files.map((item) => item.realName);

        const formatPaid = PAID[paid];

        const formatLocation = location?.address || '';

        return {
            ...remain,
            status: formatStatus,
            paid: formatPaid,
            filesName: formatFiles,
            location: formatLocation
        };
    });

    return formattedPrintingRequests;
};

const createPrintingRequest: Handler<CreatePrintingRequestResultDto> = async (req, res) => {
    try {
        const userId = req.userId;

        const printingRequestId = await prisma.printingRequest.create({
            data: {
                userId
            },
            select: { id: true }
        });

        return res.status(200).send(printingRequestId);
    } catch (err) {
        logger.error(err);
        throw new Error('Failed to create printing request');
    }
};

const parseAndCheckConfig = (configJSON: string): { missingAttributes: string[] | undefined; config: PrintingConfigs | undefined } => {
    try {
        const config = JSON.parse(configJSON);
        const missingAttributes = PRINTING_CONFIGS.filter((attr) => !config[attr]);
        return { missingAttributes: missingAttributes.length > 0 ? missingAttributes : undefined, config };
    } catch (err) {
        throw Error('Error parse and check config');
    }
};

const isPrintingRequestExist: (printingRequestId: string) => Promise<boolean> = async (printingRequestId) => {
    try {
        if (!printingRequestId) {
            throw Error('printingRequestId cannot be null');
        }

        const printingRequest = await prisma.printingRequest.findFirst({
            select: { id: true },
            where: { id: printingRequestId }
        });

        return !!printingRequest;
    } catch (error) {
        return false;
    }
};

const updateFileAndStatusOfPrintingRequestToDb = async (minioName: string, config: PrintingConfigs) => {
    try {
        await prisma.$transaction([
            prisma.printingRequest.update({
                where: {
                    id: config.printingRequestId
                },
                data: {
                    status: PRINTING_STATUS.progressing
                }
            }),
            prisma.file.create({
                data: {
                    realName: config.fileName,
                    minioName,
                    printingRequestId: config.printingRequestId
                }
            })
        ]);
    } catch (error) {
        throw new Error('Failed to update file and status to printing request');
    }
};

const handleFileUpload = async (userId: string, data: string, config: PrintingConfigs) => {
    const timestamp = Date.now();
    const fileName = `${userId}/${config.printingRequestId}/${timestamp}_${config.fileName}`;
    const buffer = Buffer.from(data);

    try {
        await prisma.$transaction(async () => {
            await updateFileAndStatusOfPrintingRequestToDb(fileName, config);
            await minio.uploadFileToMinio(fileName, buffer);
        });
    } catch (error) {
        throw new Error('File upload and database update failed');
    }
};

const uploadFileToPrintingRequest: Handler<UploadFileResultDto, { consumes: ['multipart/form-data']; Body: UploadFileInputDto }> = async (
    req,
    res
) => {
    try {
        const data = req.body.file;
        if (!data) return res.badRequest('Missing the file');

        const configJSON = req.body.config;
        if (!configJSON) {
            return res.badRequest('Missing or empty config data');
        }

        const { missingAttributes, config } = parseAndCheckConfig(configJSON);
        if (missingAttributes || !config) {
            return res.badRequest(`Config is missing the following required attributes: ${missingAttributes?.join(', ')}`);
        }

        const isPrintingRequestValid = await isPrintingRequestExist(config.printingRequestId);
        if (!isPrintingRequestValid) {
            return res.badRequest('The specified printing request does not exist or is not valid');
        }

        await handleFileUpload(req.userId, data, config);

        return {
            status: 'success',
            message: `${config.fileName} successfully uploaded`
        };
    } catch (err) {
        res.badRequest(err.message);
    }
};

const printFileFromBuffer = async (printer: Printer, fileBuffer: Buffer) => {
    try {
        await printer.print(fileBuffer);
    } catch (err) {
        throw err;
    }
};

const getFilesOfPrintingRequest = async (printingRequestId: string) => {
    const files = await prisma.file.findMany({
        where: {
            printingRequestId
        },
        select: {
            id: true,
            minioName: true,
            realName: true
        }
    });
    return files;
};

const executePrintingRequest: Handler<PrintingFileResultDto, { Body: PrintingRequestInputDto }> = async (req, res) => {
    try {
        const filesOfPrintingRequest = await getFilesOfPrintingRequest(req.body.printingRequestId);

        filesOfPrintingRequest.forEach(async (file) => {
            const buffer = await minio.getFileFromMinio(file.minioName);

            await printFileFromBuffer(nodePrinter, buffer);

            return res.status(200).send({ status: 'printing', message: 'The printing request is being executed' });
        });
    } catch (err) {
        return res.status(500).send({ status: 'fail', message: err.message });
    }
};

const getAllFilesPrintingRequest: Handler<AllFilesPrintingRequestResultDto, { Params: PrintingRequestInputDto }> = async (req, res) => {
    try {
        const filesOfPrintingRequest = await getFilesOfPrintingRequest(req.params.printingRequestId);

        const formatResult = filesOfPrintingRequest.map((item) => {
            return { id: item.id, fileName: item.realName };
        });

        return res.status(200).send(formatResult);
    } catch (err) {
        return res.status(500).send({ status: 'fail', message: 'Can not get files from printing request' });
    }
};

const removeFileInMinioAndDB = async (file: File) => {
    const fileName = file.minioName;

    logger.info(fileName);

    try {
        await prisma.$transaction(async () => {
            await prisma.file.delete({ where: { id: file.id } });
            await minio.removeFileFromMinio(fileName);
        });
    } catch (error) {
        logger.error(error);
        throw Error(`Unable to remove file ${file.realName}`);
    }
};

const deleteFilePrintingRequest: Handler<
    DeleteFilePrintingRequestResultDto,
    { Params: PrintingRequestInputDto; Body: DeleteFilePrintingRequestResultDto }
> = async (req, res) => {
    try {
        const { fileId } = req.body;
        const { printingRequestId } = req.params;

        const file = await prisma.file.findUnique({
            where: { id: fileId }
        });

        if (!file || printingRequestId !== file.printingRequestId) throw new Error('Invalid file id or printing request id');

        await removeFileInMinioAndDB(file);

        return res.status(200).send(`Remove file ${file.realName} successfully`);
    } catch (err) {
        logger.error(err.message);
        return res.status(500).send({ status: 'fail', message: err.message });
    }
};

export const printingRequestHandler = {
    getAllPrintingRequest,
    createPrintingRequest,
    uploadFileToPrintingRequest,
    getAllFilesPrintingRequest,
    deleteFilePrintingRequest,
    executePrintingRequest
};
