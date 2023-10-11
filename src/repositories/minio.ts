import { envs } from '@configs';
import * as Minio from 'minio';

export const minioClient = new Minio.Client({
    endPoint: envs.MINIO_SERVER_ENDPOINT,
    port: envs.MINIO_PORT,
    useSSL: false,
    accessKey: envs.MINIO_ACCESS_KEY,
    secretKey: envs.MINIO_SECRET_KEY
});
