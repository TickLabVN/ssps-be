import NodeCache from 'node-cache';
import { prisma } from '@repositories';

const cache = new NodeCache({ stdTTL: 300 });

//TODO: Please remove it if do not plan to use it in the future.
// export const PRINTING_CONFIGS = ['fileName', 'printingRequestId'];

export const COIN_PER_PAGE: Promise<number> = (async () => {
    const cachedValue = cache.get('coinPerPage');
    if (cachedValue) {
        return cachedValue as number;
    }
    try {
        const coinPerPageConfiguration = await prisma.configuration.findFirst({
            select: { value: true },
            where: { name: 'coin per page' }
        });
        const coinPerPage = Number(coinPerPageConfiguration?.value) || 2;

        cache.set('coinPerPage', coinPerPage);
        return coinPerPage;
    } catch (error) {
        throw new Error('Failed to retrieve "coin per page" configuration:', error);
    }
})();

export const ACCEPTED_EXTENSIONS: Promise<string[]> = (async () => {
    try {
        const acceptedExtensionsConfiguration = await prisma.configuration.findFirst({
            select: { value: true },
            where: { name: 'accepted extensions' }
        });

        if (!acceptedExtensionsConfiguration) {
            throw new Error('No "accepted extensions" configuration found.');
        }

        const serializedExtensions = acceptedExtensionsConfiguration.value;

        const acceptedExtensions = JSON.parse(serializedExtensions);

        return acceptedExtensions;
    } catch (error) {
        throw new Error('Failed to retrieve "accepted extensions" configuration:', error);
    }
})();
