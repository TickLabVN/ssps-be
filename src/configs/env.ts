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
    MINIO_BUCKET_NAME: str(),
    CHECKOUT_ENVIRONMENT: str(),
    PAYPAL_LIVE_ENDPOINT: str(),
    PAYPAL_SANDBOX_ENDPOINT: str(),
    PAYPAL_CLIENT_ID: str(),
    PAYPAL_CLIENT_SECRET: str()
});

export const CORS_WHITE_LIST = envs.CORS_WHITE_LIST.split(',');
export const PAYPAL_ENDPOINT = envs.CHECKOUT_ENVIRONMENT === 'live' ? envs.PAYPAL_LIVE_ENDPOINT : envs.PAYPAL_SANDBOX_ENDPOINT;
