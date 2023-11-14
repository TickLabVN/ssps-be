import { logger } from '@utils';
import { config as configEnv } from 'dotenv';
import { str, url, host, port, cleanEnv } from 'envalid';
import path from 'path';

const envFilePath = path.join(process.cwd(), '.env');
if (!envFilePath) {
    logger.error('.env file not found.');
    process.exit(1); // Exit the process with an error code
}
configEnv({ path: envFilePath });

export const envs = cleanEnv(
    process.env,
    {
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
        GOOGLE_CLIENT_ID: str({ default: 'anc' }),
        GOOGLE_CLIENT_SECRET: str(),
        GOOGLE_REDIRECT_URL: url()
    },
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        reporter: ({ errors, env }) => {
            logger.error(`error of envs: ${errors}`);
            for (const [envVar, err] of Object.entries(errors)) {
                logger.error(`Invalid env '${envVar}': ${Object.keys(err.message)}`);
            }
        }
    }
);

export const CORS_WHITE_LIST = envs.CORS_WHITE_LIST.split(',');
export const PAYPAL_ENDPOINT = envs.CHECKOUT_ENVIRONMENT === 'live' ? envs.PAYPAL_LIVE_ENDPOINT : envs.PAYPAL_SANDBOX_ENDPOINT;
