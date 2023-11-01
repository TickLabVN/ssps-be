import NodeCache from 'node-cache';
import { prisma } from '@repositories';
import { logger } from '@utils';

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
        logger.error('Failed to retrieve "coin per page" configuration:', error);
        return 200;
    }
})();

export const ACCEPTED_EXTENSIONS = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.jpg', '.png', '.pdf'];
