import { updateAcceptedExtensionDto } from '@dtos/in';
import {
    AcceptedExtensionDto,
    CoinPerPageDto,
    CoinPerSemDto,
    ConfigurationDto,
    DollarToCoinDto,
    MaxFileSizeDto,
    ServiceFeeDto
} from '@dtos/out';
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

const getServiceFee: Handler<ServiceFeeDto> = async () => {
    try {
        return await DBConfiguration.serviceFee();
    } catch (err) {
        logger.error('Error when getting service fee configuration:', err);
        throw err;
    }
};

const getCoinPerPage: Handler<CoinPerPageDto> = async () => {
    try {
        return await DBConfiguration.coinPerPage();
    } catch (err) {
        logger.error('Error when getting coin per page configuration:', err);
        throw err;
    }
};

const getCoinPerSem: Handler<CoinPerSemDto> = async () => {
    try {
        return await DBConfiguration.coinPerSem();
    } catch (err) {
        logger.error('Error when getting coin per semester configuration:', err);
        throw err;
    }
};

const getDollarToCoin: Handler<DollarToCoinDto> = async () => {
    try {
        return await DBConfiguration.dollarToCoin();
    } catch (err) {
        logger.error('Error when getting 1 dollar to coin ratio configuration:', err);
        throw err;
    }
};

const getCoinToVnd: Handler<DollarToCoinDto> = async () => {
    try {
        return await DBConfiguration.coinToVnd();
    } catch (err) {
        logger.error('Error when getting coin to VND ratio configuration:', err);
        throw err;
    }
};

const getMaxFileSizeDto: Handler<MaxFileSizeDto> = async () => {
    try {
        return await DBConfiguration.maxFileSize();
    } catch (err) {
        logger.error('Error when getting max file size configuration:', err);
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
    updateAcceptedExtension,
    getServiceFee,
    getCoinPerPage,
    getCoinPerSem,
    getDollarToCoin,
    getCoinToVnd,
    getMaxFileSizeDto
};
