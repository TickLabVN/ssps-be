import NodeCache from 'node-cache';
import { prisma } from '@repositories';
import {
    DEFAULT_ACCEPTED_EXTENSION,
    DEFAULT_COIN_PER_PAGE,
    DEFAULT_COIN_PER_SEM,
    DEFAULT_DOLLAR_TO_COIN,
    DEFAULT_MAX_FILE_SIZE
} from '@constants';
import { logger } from '@utils';

const cache = new NodeCache({ stdTTL: 300 });

const getAll: () => Promise<
    {
        name: string;
        value: string;
    }[]
> = async () => {
    try {
        const configurations = await prisma.configuration.findMany({
            select: { name: true, value: true }
        });
        return configurations;
    } catch (error) {
        logger.error('Failed to retrieve configurations:', error);
        throw error;
    }
};

const coinPerPage: () => Promise<number> = async () => {
    const cachedValue = cache.get('coinPerPage');
    if (cachedValue) {
        return cachedValue as number;
    }
    try {
        const coinPerPageConfiguration = await prisma.configuration.findMany({
            select: { value: true },
            where: { name: 'coin per page' }
        });
        if (coinPerPageConfiguration.length === 0) {
            logger.warn(`No "coin per page" configuration found. Using default value: ${DEFAULT_COIN_PER_PAGE}.`);
            return DEFAULT_COIN_PER_PAGE;
        }
        const coinPerPage = Number(coinPerPageConfiguration[0]?.value);

        cache.set('coinPerPage', coinPerPage);
        return coinPerPage;
    } catch (error) {
        logger.error(error);
        throw new Error('Failed to retrieve "coin per page" configuration:', error);
    }
};

const acceptedExtensions: () => Promise<string[]> = async () => {
    try {
        const acceptedExtensionsConfiguration = await prisma.configuration.findMany({
            select: { value: true },
            where: { name: 'accepted extensions' }
        });

        if (acceptedExtensionsConfiguration.length === 0) {
            logger.warn(`No "accepted extensions" configuration found. Using default extensions: ${DEFAULT_ACCEPTED_EXTENSION}.`);
            return DEFAULT_ACCEPTED_EXTENSION;
        }

        const serializedExtensions = acceptedExtensionsConfiguration[0].value;

        const acceptedExtensions = JSON.parse(serializedExtensions) as string[];

        return acceptedExtensions;
    } catch (error) {
        throw new Error('Failed to retrieve "accepted extensions" configuration:', error);
    }
};

const coinPerSem: () => Promise<number> = async () => {
    try {
        const coinPerSemConfiguration = await prisma.configuration.findMany({
            select: { value: true },
            where: { name: 'coin per sem' }
        });
        if (coinPerSemConfiguration.length === 0) {
            logger.warn(`No "coin per sem" configuration found. Using default value: ${DEFAULT_COIN_PER_SEM}.`);
            return DEFAULT_COIN_PER_SEM;
        }
        const coinPerSem = Number(coinPerSemConfiguration[0]?.value);

        return coinPerSem;
    } catch (error) {
        throw new Error('Failed to retrieve "coin per sem" configuration:', error);
    }
};

const dollarToCoin: () => Promise<number> = async () => {
    try {
        const dollarToCoinConfiguration = await prisma.configuration.findMany({
            select: { value: true },
            where: { name: 'dollar to coin' }
        });
        if (dollarToCoinConfiguration.length === 0) {
            logger.warn(`No "dollar to coin" configuration found. Using default value: ${DEFAULT_DOLLAR_TO_COIN}.`);
            return DEFAULT_DOLLAR_TO_COIN;
        }
        const coinPerSem = Number(dollarToCoinConfiguration[0]?.value);

        return coinPerSem;
    } catch (error) {
        throw new Error('Failed to retrieve "dollar to coin" configuration:', error);
    }
};

const maxFileSize: () => Promise<number> = async () => {
    try {
        const maxFileSizeConfiguration = await prisma.configuration.findMany({
            select: { value: true },
            where: { name: 'max file size' }
        });
        if (maxFileSizeConfiguration.length === 0) {
            logger.warn(`No "max file size" configuration found. Using default value: ${DEFAULT_MAX_FILE_SIZE / (1024 * 1024)} mb.`);
            return DEFAULT_MAX_FILE_SIZE;
        }
        const coinPerSem = Number(maxFileSizeConfiguration[0]?.value);

        return coinPerSem;
    } catch (error) {
        throw new Error('Failed to retrieve "max file size" configuration:', error);
    }
};

export const DBConfiguration = { acceptedExtensions, coinPerPage, coinPerSem, dollarToCoin, getAll, maxFileSize };
