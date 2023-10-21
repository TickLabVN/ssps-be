import { config as configEnv } from 'dotenv';
import { str, num, cleanEnv } from 'envalid';

configEnv();

export const envs = cleanEnv(process.env, {
    NODE_ENV: str<NodeEnv>({
        devDefault: 'development',
        choices: ['development', 'test', 'production']
    }),
    JWT_SECRET: str(),
    COOKIE_SECRET: str(),
    CORS_WHITE_LIST: str(),
    MINIO_URL: str(),
    MINIO_SERVER_ENDPOINT: str(),
    MINIO_PORT: num(),
    MINIO_ACCESS_KEY: str(),
    MINIO_SECRET_KEY: str(),
    MINIO_BUCKET_NAME: str()
});

export const CORS_WHITE_LIST = envs.CORS_WHITE_LIST.split(',');
