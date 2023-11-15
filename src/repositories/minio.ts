import { envs } from '@configs';
import * as Minio from 'minio';

export const minioClient = new Minio.Client({
    endPoint: envs.MINIO_SERVER_ENDPOINT || '14.225.192.183',
    port: Number(envs.MINIO_PORT) || 9000,
    useSSL: false,
    accessKey: envs.MINIO_ACCESS_KEY || '',
    secretKey: envs.MINIO_SECRET_KEY || ''
});
