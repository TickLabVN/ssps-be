import { Handler } from '@interfaces';
import { UploadFileResultDto } from '@dtos/out';
import { logger, minio } from '@utils';
import { UploadFileInputDto } from '@dtos/in';
import { PRINTING_CONFIGS } from '@configs';
import { PrintingConfigs } from 'src/types/printing';
import { prisma } from '@repositories';

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
        logger.info(printingRequestId);

        if (!printingRequestId) {
            throw Error('printingRequestId cannot be null');
        }

        const printingRequest = await prisma.printingRequest.findFirst({
            select: { id: true },
            where: { id: printingRequestId }
        });

        logger.info(printingRequest);

        return !!printingRequest;
    } catch (error) {
        return false;
    }
};

const handleFileUpload = async (userId: string, data: string, config: PrintingConfigs) => {
    const timestamp = Date.now();
    const fileName = `${userId}/${config.printingRequestId}/${timestamp}_${config.fileName}`;
    const buffer = Buffer.from(data);

    await minio.uploadFileToMinio(fileName, buffer);

    await prisma.printingRequest.update({
        where: {
            id: config.printingRequestId
        },
        data: {
            fileNames: {
                push: fileName
            }
        }
    });
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
