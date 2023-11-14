import * as Minio from 'minio';

export const minioClient = new Minio.Client({
    //TODO: using envs
    endPoint: process.env.MINIO_SERVER_ENDPOINT || '14.225.192.183',
    port: Number(process.env.MINIO_PORT) || 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET_KEY || ''
});
