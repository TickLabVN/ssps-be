import { loggerConfig } from '@configs';
import pino from 'pino';

//TODO: using envs
export const logger = pino(loggerConfig['development']);
