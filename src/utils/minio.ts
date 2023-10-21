import { minioClient } from '@repositories';
import { envs } from '@configs';

const uploadFileToMinio = async (objectName: string, fileBuffer: Buffer) => {
    const bucketExists = await minioClient.bucketExists(envs.MINIO_BUCKET_NAME);
    if (!bucketExists) {
        throw new Error("Bucket doesn't exist");
    }
    try {
        await minioClient.putObject(envs.MINIO_BUCKET_NAME, objectName, fileBuffer);
    } catch (error) {
        throw new Error(`Error upload file to Minio: ${error.message}`);
    }
};

const removeFileFromMinio = async (objectName: string) => {
    const bucketExists = await minioClient.bucketExists(envs.MINIO_BUCKET_NAME);

    if (!bucketExists) {
        throw new Error("Bucket doesn't exist");
    }

    try {
        await minioClient.removeObject(envs.MINIO_BUCKET_NAME, objectName);
    } catch (error) {
        throw new Error(`Error removing file from Minio: ${error.message}`);
    }
};

const getFileFromMinio = async (objectName: string): Promise<Buffer> => {
    const bucketExists = await minioClient.bucketExists(envs.MINIO_BUCKET_NAME);
    if (!bucketExists) {
        throw new Error("Bucket doesn't exist");
    }

    try {
        const dataStream = await minioClient.getObject(envs.MINIO_BUCKET_NAME, objectName);
        const chunks: Buffer[] = [];

        return new Promise((resolve, reject) => {
            dataStream.on('data', (chunk) => {
                chunks.push(chunk);
            });

            dataStream.on('end', () => {
                const fileBuffer = Buffer.concat(chunks);
                resolve(fileBuffer);
            });

            dataStream.on('error', (error) => {
                reject(error);
            });
        });
    } catch (error) {
        throw new Error(`Error fetching file from Minio: ${error.message}`);
    }
};

export const minio = { uploadFileToMinio, getFileFromMinio, removeFileFromMinio };
