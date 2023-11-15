import { prisma } from '@repositories';
import { logger } from '@utils';

export const DOLLAR_TO_COIN: Promise<number> = (async () => {
    try {
        const dollarToCoinConfiguration = await prisma.configuration.findFirst({
            select: { value: true },
            where: { name: 'coin per page' }
        });
        const dollarToCoin = Number(dollarToCoinConfiguration?.value) || 73;

        return dollarToCoin;
    } catch (error) {
        logger.error('Failed to retrieve "coin per page" configuration:', error);
        return 200;
    }
})();
