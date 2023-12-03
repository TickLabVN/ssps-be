import { nodePrinter, prisma } from '@repositories';
import {
    AllFilesPrintingRequestResultDto,
    CancelPrintingRequestResultDto,
    CreatePrintingRequestResultDto,
    DeleteFilePrintingRequestResultDto,
    FilePrintNumberChangeRequestResultDto,
    GetPrintingRequestResultDto,
    PrintingFileResultDto,
    UploadConfigResultDto,
    UploadFileResultDto
} from '@dtos/out';
import { Handler, Printer } from '@interfaces';
import { PAID, PRINTING_STATUS } from '@constants';
import { editPdf, generateUniqueHashFileName, logger, minio } from '@utils';
import {
    FilePrintAmountChangeRequestBodyDto,
    MultiFilePrintAmountChangeRequestBodyDto,
    PrintingRequestInputDto,
    UploadConfigBodyDto,
    UploadConfigParamsDto,
    UploadFileParamsDto
} from '@dtos/in';
import { envs } from '@configs';
import { File } from '@prisma/client';
import { MultipartFile } from '@fastify/multipart';
import pdf from 'pdf-parse';
import { DBConfiguration } from '@handlers';

const getAllPrintingRequest: Handler<GetPrintingRequestResultDto> = async (req) => {
    const userId = req.userId;

    const printingRequests = await prisma.printingRequest.findMany({
        select: {
            id: true,
            status: true,
            location: { select: { address: true } },
            numFiles: true,
            numPages: true,
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

const updateFileAndStatusOfPrintingRequestToDb = async (
    printingRequestId: string,
    fileMetadata: {
        fileName: string;
        minioName: string;
        fileCoin: number;
        fileSize: number;
        numPage: number;
    }
) => {
    try {
        const { fileName, ...remainMetadata } = fileMetadata;
        const [, createdFile] = await prisma.$transaction([
            prisma.printingRequest.update({
                where: {
                    id: printingRequestId
                },
                data: {
                    coins: { increment: fileMetadata.fileCoin },
                    numPages: { increment: fileMetadata.numPage },
                    numFiles: { increment: 1 }
                }
            }),
            prisma.file.create({
                data: {
                    printingRequestId: printingRequestId,
                    ...remainMetadata,
                    realName: fileName
                }
            })
        ]);

        if (!createdFile) {
            throw new Error('Failed to create the file.');
        }

        return { id: createdFile.id, fileNum: createdFile.fileNum };
    } catch (error) {
        throw new Error('Failed to update file and status to the printing request');
    }
};

const handleUploadingFile = async (printingRequestId: string, file: Buffer, fileName: string) => {
    const objectName = `${printingRequestId}/${generateUniqueHashFileName(fileName)}`;

    const coinPerPage = await DBConfiguration.coinPerPage();

    try {
        const fileInformation = await prisma.$transaction(async () => {
            const fileExtension = fileName.split('.').pop();
            const numPage = fileExtension === 'pdf' ? await getNumPages(file) : 1;

            const fileMetadata = {
                fileName: fileName,
                minioName: objectName,
                fileCoin: numPage * coinPerPage,
                fileSize: file.length,
                numPage
            };

            const { id, fileNum } = await updateFileAndStatusOfPrintingRequestToDb(printingRequestId, fileMetadata);
            await minio.uploadFileToMinio(objectName, file);
            return { ...fileMetadata, fileId: id, fileNum };
        });

        const { minioName, ...remainInfor } = fileInformation;

        return {
            ...remainInfor,
            fileURL: `${envs.MINIO_URL}/${envs.MINIO_BUCKET_NAME}/${minioName}`
        };
    } catch (error) {
        logger.error(error);
        throw new Error('File upload and database update failed');
    }
};

const handleUploadingConfig = async (fileId: string, config: UploadConfigBodyDto) => {
    try {
        const file = await prisma.file.findUnique({
            where: {
                id: fileId
            }
        });

        if (!file) throw new Error(`File ${fileId} doesn't exist`);

        const configJSON = JSON.stringify(config);
        const configBuffer = Buffer.from(configJSON);

        await prisma.$transaction(async () => {
            const oldAmountPrinting = file.fileNum;

            const increaseFactor = config.numOfCopies - oldAmountPrinting;

            await prisma.file.update({
                where: {
                    id: fileId
                },
                data: {
                    fileNum: config.numOfCopies
                }
            });

            if (increaseFactor !== 0) {
                await prisma.printingRequest.update({
                    where: { id: file.printingRequestId },
                    data: {
                        coins: { [increaseFactor > 0 ? 'increment' : 'decrement']: Math.abs(increaseFactor) * file.fileCoin },
                        numPages: { [increaseFactor > 0 ? 'increment' : 'decrement']: Math.abs(increaseFactor) * file.numPage }
                    }
                });
            }
            const configName = convertFileNameToConfigFileName(file.minioName);
            await removeConfigInMinio(file);

            await minio.uploadFileToMinio(configName, configBuffer);
        });

        return;
    } catch (error) {
        throw new Error(`Update config ${fileId} failed: ${error.message}`);
    }
};

/**
 * Get the number of pages in a PDF file.
 * @param {Buffer} file - The PDF file buffer.
 * @returns {Promise<number>} The number of pages in the PDF file.
 * @throws {Error} If an error occurs while parsing the PDF or if the file is not a valid PDF.
 */
const getNumPages = async (file: Buffer) => {
    try {
        const data = await pdf(file);
        return data.numpages;
    } catch (err) {
        throw new Error(`Failed to get the number of pages in the PDF: ${err}`);
    }
};

const uploadFileToPrintingRequest: Handler<
    UploadFileResultDto,
    { Params: UploadFileParamsDto; consumes: ['multipart/form-data']; Body: { file: MultipartFile } }
> = async (req, res) => {
    const validateMultipartFile = async (file: MultipartFile) => {
        try {
            const maxFileSize = await DBConfiguration.maxFileSize();

            const acceptedFileExtension = await DBConfiguration.acceptedExtensions();
            const fileExtension = file.filename.split('.').pop();

            if (!fileExtension || !acceptedFileExtension.includes(`${fileExtension}`)) {
                return { error: `Invalid file format. Accepted formats: ${acceptedFileExtension}` };
            }

            const fileBuffer = await file.toBuffer();

            if (fileBuffer.length > maxFileSize) {
                return { error: 'File size exceeds the 100MB limit.' };
            }

            return null;
        } catch (err) {
            return { error: 'Error occurred while validating the file.' };
        }
    };

    try {
        const data = req.body.file;

        if (!data) return res.badRequest('Missing the file');

        const validationResult = await validateMultipartFile(data);

        if (validationResult && validationResult.error) {
            return res.badRequest(validationResult.error);
        }

        const printingRequestId = req.params.printingRequestId;

        const fileName = data.filename;
        const buffer = await data.toBuffer();

        const isPrintingRequestValid = await isPrintingRequestExist(printingRequestId);
        if (!isPrintingRequestValid) {
            return res.badRequest('The specified printing request does not exist or is not valid');
        }

        const fileInformation = await handleUploadingFile(printingRequestId, buffer, fileName);

        return res.status(200).send(fileInformation);
    } catch (err) {
        logger.error('Error when uploading file to printing request');
        res.badRequest(err.message);
    }
};

const convertFileNameToConfigFileName = (objectName: string) => {
    const fileExtension = objectName.split('.').pop();

    if (!fileExtension) {
        throw new Error('Invalid minioName in the file');
    }

    const configName = objectName.replace(`.${fileExtension}`, '.json');

    return configName;
};

const getConfigOfFile = async (minioName: string) => {
    const configName = convertFileNameToConfigFileName(minioName);

    const configBuffer = await minio.getFileFromMinio(configName);

    const configString = configBuffer.toString('utf-8');

    const config: UploadConfigBodyDto = JSON.parse(configString);

    return config;
};

const uploadConfigToPrintingRequest: Handler<UploadConfigResultDto, { Params: UploadConfigParamsDto; Body: UploadConfigBodyDto }> = async (
    req,
    res
) => {
    try {
        const fileConfig = req.body;
        if (!fileConfig) {
            return res.badRequest('Missing config data');
        }

        const fileId = req.params.fileId;

        await handleUploadingConfig(fileId, fileConfig);

        return res.status(200).send({
            status: 'Configuration uploaded successfully'
        });
    } catch (err) {
        res.badRequest(err.message);
    }
};

const printFileFromBuffer = async (printer: Printer, fileBuffer: Buffer) => {
    try {
        await printer.print(fileBuffer, 'AUTO', 'PDF');
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
            realName: true,
            fileCoin: true,
            fileSize: true,
            numPage: true,
            fileNum: true
        },
        orderBy: { created_at: 'desc' }
    });
    return files;
};

const executePrintingRequest: Handler<PrintingFileResultDto, { Body: PrintingRequestInputDto }> = async (req, res) => {
    try {
        const filesOfPrintingRequest = await getFilesOfPrintingRequest(req.body.printingRequestId);

        filesOfPrintingRequest.forEach(async (file) => {
            const buffer = await minio.getFileFromMinio(file.minioName);
            const config = await getConfigOfFile(file.minioName);

            const configurationBuffer = await editPdf.editPdfPrinting(
                buffer,
                config.pageSide,
                config.pages,
                config.layout,
                Number(config.pagesPerSheet) as PagePerSheet
            );

            for (let i = 0; i < file.fileNum; i++) await printFileFromBuffer(nodePrinter, configurationBuffer);
        });

        return res.status(200).send({ status: 'printing', message: 'The printing request is being executed' });
    } catch (err) {
        logger.error(err);
        return res.status(500).send({ status: 'fail', message: err.message });
    }
};

const getAllFilesPrintingRequest: Handler<AllFilesPrintingRequestResultDto, { Params: PrintingRequestInputDto }> = async (req, res) => {
    try {
        const filesOfPrintingRequest = await getFilesOfPrintingRequest(req.params.printingRequestId);

        const formatResult: FileInformation[] = filesOfPrintingRequest.map((item) => {
            return {
                fileId: item.id,
                fileName: item.realName,
                fileCoin: item.fileCoin,
                fileSize: item.fileSize,
                fileURL: `${envs.MINIO_URL}/${envs.MINIO_BUCKET_NAME}/${item.minioName}`,
                numPage: item.numPage,
                numOfCopies: item.fileNum
            };
        });

        return res.status(200).send(formatResult);
    } catch (err) {
        logger.error(err);
        return res.status(500).send({ status: 'fail', message: 'Can not get files from printing request' });
    }
};

const removeFileInMinioAndDB = async (file: File) => {
    const fileName = file.minioName;

    try {
        await prisma.$transaction(async () => {
            await prisma.printingRequest.update({
                where: { id: file.printingRequestId },
                data: {
                    numFiles: { decrement: 1 },
                    coins: {
                        decrement: file.fileCoin * file.fileNum
                    },
                    numPages: { decrement: file.numPage * file.fileNum }
                }
            });
            await prisma.file.delete({ where: { id: file.id } });
            await minio.removeFileFromMinio(fileName);
        });
    } catch (error) {
        logger.error(error);
        throw Error(`Unable to remove file ${file.realName}`);
    }
};

const removeConfigInMinio = async (file: File) => {
    try {
        const configName = convertFileNameToConfigFileName(file.minioName);

        const isConfigFileExist = await minio.isObjectExistInMinio(envs.MINIO_BUCKET_NAME, configName);

        if (!isConfigFileExist) return;

        await minio.removeFileFromMinio(configName);
    } catch (error) {
        logger.error(error);
        throw new Error(`Unable to remove the config file for ${file.realName}`);
    }
};

const deleteFilePrintingRequest: Handler<DeleteFilePrintingRequestResultDto, { Params: DeleteFilePrintingRequestResultDto }> = async (
    req,
    res
) => {
    try {
        const { fileId } = req.params;

        const file = await prisma.file.findUnique({
            where: { id: fileId }
        });

        if (!file) throw new Error('Invalid file id');

        const isFileExist = await minio.isObjectExistInMinio(envs.MINIO_BUCKET_NAME, file.minioName);
        if (!isFileExist) res.notFound("File doesn't exist");

        await removeFileInMinioAndDB(file);
        await removeConfigInMinio(file);

        return res.status(200).send({
            status: 'success',
            fileId: file.id,
            fileName: file.realName,
            message: `Remove file ${file.realName} successfully`
        });
    } catch (err) {
        logger.error(err);
        return res.status(500).send({ status: 'fail', message: err.message });
    }
};

const cancelPrintingRequest: Handler<CancelPrintingRequestResultDto, { Params: PrintingRequestInputDto }> = async (req, res) => {
    try {
        const printingRequest = await prisma.printingRequest.findUnique({
            where: {
                id: req.params.printingRequestId
            }
        });

        if (!printingRequest) {
            return res.status(404).send({
                error: 'Printing request not found'
            });
        }

        if (printingRequest.status === PRINTING_STATUS.ready) {
            return res.status(400).send({
                error: 'Cannot cancel a printing request that is ready'
            });
        }

        await prisma.printingRequest.update({
            where: {
                id: req.params.printingRequestId
            },
            data: {
                status: PRINTING_STATUS.canceled
            }
        });

        return res.status(200).send({
            printingStatus: PRINTING_STATUS.canceled
        });
    } catch (err) {
        logger.error(err);
        return res.status(500).send({
            error: 'Internal server error'
        });
    }
};

const updateFilePrintNumber = async (file: File, numOfCopies: number) => {
    const config: UploadConfigBodyDto = await getConfigOfFile(file.minioName);

    const newConfig = {
        numOfCopies: numOfCopies,
        layout: config.layout,
        pages: config.pages,
        pagesPerSheet: config.pagesPerSheet,
        pageSide: config.pageSide
    };

    await handleUploadingConfig(file.id, newConfig);
};

const mutilFilePrintNumberChangeRequest: Handler<
    FilePrintNumberChangeRequestResultDto,
    { Body: MultiFilePrintAmountChangeRequestBodyDto }
> = async (req, res) => {
    try {
        req.body.forEach(async ({ fileId, numOfCopies }) => {
            const file = await prisma.file.findUnique({
                where: { id: fileId }
            });

            if (!file) throw new Error('Invalid file id');

            const isFileExist = await minio.isObjectExistInMinio(envs.MINIO_BUCKET_NAME, file.minioName);
            if (!isFileExist) res.notFound("File doesn't exist");

            await prisma.$transaction(async () => {
                await updateFilePrintNumber(file, numOfCopies);
            });
        });

        return res.status(200).send({
            status: 'success'
        });
    } catch (err) {
        logger.error(err);
        return res.status(500).send({
            status: 'fail',
            message: 'Internal server error'
        });
    }
};

const filePrintNumberChangeRequest: Handler<FilePrintNumberChangeRequestResultDto, { Body: FilePrintAmountChangeRequestBodyDto }> = async (
    req,
    res
) => {
    try {
        const { fileId, numOfCopies } = req.body;

        if (numOfCopies < 1) return res.badRequest('The amount printing minimal is 1');

        const file = await prisma.file.findUnique({
            where: { id: fileId }
        });

        if (!file) return res.badRequest('Invalid file id');

        if (file.fileNum === numOfCopies) return res.badRequest('The amount printing is unchanged');

        const isFileExist = await minio.isObjectExistInMinio(envs.MINIO_BUCKET_NAME, file.minioName);
        if (!isFileExist) res.notFound("File doesn't exist");

        await prisma.$transaction(async () => {
            await updateFilePrintNumber(file, numOfCopies);
        });

        return res.status(200).send({
            status: 'success'
        });
    } catch (err) {
        logger.error(err);
        return res.status(500).send({
            status: 'fail',
            message: 'Internal server error'
        });
    }
};

export const printingRequestHandler = {
    getAllPrintingRequest,
    createPrintingRequest,
    uploadFileToPrintingRequest,
    uploadConfigToPrintingRequest,
    getAllFilesPrintingRequest,
    deleteFilePrintingRequest,
    executePrintingRequest,
    cancelPrintingRequest,
    mutilFilePrintNumberChangeRequest,
    filePrintNumberChangeRequest
};
