import { PrintingStatus } from '@prisma/client';

export const PRINTING_STATUS: Record<string, PrintingStatus> = {
    progressing: 'progressing',
    ready: 'ready',
    done: 'done',
    canceled: 'canceled'
};

export const PAID = {
    paid: 'paid',
    not_paid: 'not paid'
};

export const DEFAULT_ACCEPTED_EXTENSION = ['pdf'];
export const DEFAULT_COIN_PER_PAGE = 2;
export const DEFAULT_COIN_PER_SEM = 100;
export const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024;
export const DEFAULT_SERVICE_FEE = 5;
