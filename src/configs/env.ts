import { config as configEnv } from 'dotenv';
import { str, url, host, port, cleanEnv } from 'envalid';
import path from 'path';

const envFilePath = path.join(process.cwd(), '.env');
if (!envFilePath) {
    console.error('.env file not found.');
    process.exit(1);
}
configEnv({ path: envFilePath });

export const envs = cleanEnv(process.env, {
    NODE_ENV: str<NodeEnv>({
        devDefault: 'development',
        choices: ['development', 'test', 'production']
    }),
    JWT_SECRET: str(),
    COOKIE_SECRET: str(),
    CORS_WHITE_LIST: str(),
    MINIO_URL: url(),
    MINIO_SERVER_ENDPOINT: host(),
    MINIO_PORT: port(),
    MINIO_ACCESS_KEY: str(),
    MINIO_SECRET_KEY: str(),
    MINIO_BUCKET_NAME: str(),
    CHECKOUT_ENVIRONMENT: str(),
    PAYPAL_LIVE_ENDPOINT: url(),
    PAYPAL_SANDBOX_ENDPOINT: url(),
    PAYPAL_CLIENT_ID: str(),
    PAYPAL_CLIENT_SECRET: str(),
    OPEN_EXCHANGE_RATES_ENDPOINT: url(),
    OPEN_EXCHANGE_RATES_APP_ID: str(),
    GOOGLE_CLIENT_ID: str({ default: 'anc' }),
    GOOGLE_CLIENT_SECRET: str(),
    GOOGLE_REDIRECT_URL: url(),
    UI_HOME_URL: url()
});

export const CORS_WHITE_LIST = envs.CORS_WHITE_LIST.split(',');
export const PAYPAL_ENDPOINT = envs.CHECKOUT_ENVIRONMENT === 'live' ? envs.PAYPAL_LIVE_ENDPOINT : envs.PAYPAL_SANDBOX_ENDPOINT;
