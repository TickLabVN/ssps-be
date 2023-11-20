import { updateAcceptedExtensionDto } from '@dtos/in';
import { AcceptedExtensionDto, ConfigurationDto } from '@dtos/out';
import { DBConfiguration } from '@handlers';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { logger } from '@utils';

const getConfigurations: Handler<ConfigurationDto> = async () => {
    try {
        return await DBConfiguration.getAll();
    } catch (err) {
        logger.error('Error when getting accepted extension configuration:', err);
        throw err;
    }
};

const getAcceptedExtension: Handler<AcceptedExtensionDto> = async () => {
    try {
        return await DBConfiguration.acceptedExtensions();
    } catch (err) {
        logger.error('Error when getting accepted extension configuration:', err);
        throw err;
    }
};

const updateAcceptedExtension: Handler<AcceptedExtensionDto, { Body: updateAcceptedExtensionDto }> = async (req, res) => {
    const { acceptedExtensions } = req.body;
    if (acceptedExtensions.length === 0) return res.badRequest('Needing at least one extension');

    try {
        const currentAcceptedExtensionsString = JSON.stringify(await DBConfiguration.acceptedExtensions());

        const newAcceptedExtensionsString = JSON.stringify(acceptedExtensions);

        if (newAcceptedExtensionsString === currentAcceptedExtensionsString) return res.badRequest('Update have no changes');

        const newAcceptedExtensions = await prisma.configuration.update({
            where: { name: 'accepted extensions' },
            data: { value: newAcceptedExtensionsString },
            select: { value: true }
        });

        return res.send(newAcceptedExtensions.value);
    } catch (err) {
        logger.error('Error when updating accepted extension configuration:', err);
        throw err;
    }
};

export const configurationHandler = {
    getAcceptedExtension,
    getConfigurations,
    updateAcceptedExtension
};
