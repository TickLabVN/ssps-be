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
