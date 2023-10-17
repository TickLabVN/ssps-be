import { Handler } from '@interfaces';
import { UploadFileResultDto } from '@dtos/out';
import { minio } from '@utils';
import { UploadFileInputDto } from '@dtos/in';
import { PRINTING_CONFIGS } from '@configs';
import { PrintingConfigs } from 'src/types/printing';
import { prisma } from '@repositories';
import { PRINTING_STATUS } from '@constants';

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
        await minio.uploadFileToMinio(fileName, buffer);
        await updateFileAndStatusOfPrintingRequestToDb(fileName, config);
    } catch (error) {
        await minio.removeFileFromMinio(fileName);
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

export const uploadFileHandler = {
    uploadFileToPrintingRequest: uploadFileToPrintingRequest
};
