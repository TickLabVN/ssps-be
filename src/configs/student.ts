import { prisma } from '@repositories';

export const COIN_PER_SEM: Promise<number> = (async () => {
    try {
        const coinPerSemConfiguration = await prisma.configuration.findFirst({
            select: { value: true },
            where: { name: 'coin per sem' }
        });
        const coinPerSem = Number(coinPerSemConfiguration?.value) || 100;

        return coinPerSem;
    } catch (error) {
        throw new Error('Failed to retrieve "coin per sem" configuration:', error);
    }
})();
