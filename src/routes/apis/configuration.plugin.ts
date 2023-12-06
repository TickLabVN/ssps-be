import { USER_ROLES } from '@constants';
import { updateAcceptedExtensionDto } from '@dtos/in';
import {
    AcceptedExtensionDto,
    BonusCoinPer100000VndDto,
    CoinPerPageDto,
    CoinPerSemDto,
    CoinToVNDDto,
    ConfigurationDto,
    DollarToCoinDto,
    MaxFileSizeDto,
    ServiceFeeDto
} from '@dtos/out';
import { configurationHandler } from '@handlers';
import { createRoutes } from '@utils';

export const configurationPlugin = createRoutes('Configuration', [
    {
        method: 'GET',
        url: '/',
        roles: [USER_ROLES.admin],
        schema: {
            summary: 'Get list configurations',
            description: 'Get all current name and value of configurations',
            response: {
                200: ConfigurationDto
            }
        },
        handler: configurationHandler.getConfigurations
    },
    {
        method: 'GET',
        url: '/acceptedExtension',
        roles: ['*'],
        schema: {
            summary: 'Get list accepted extensions',
            description: 'Get all current accepted extensions of printing file',
            response: {
                200: AcceptedExtensionDto
            }
        },
        handler: configurationHandler.getAcceptedExtension
    },
    {
        method: 'GET',
        url: '/serviceFee',
        roles: ['*'],
        schema: {
            summary: '',
            description: '',
            response: {
                200: ServiceFeeDto
            }
        },
        handler: configurationHandler.getServiceFee
    },
    {
        method: 'GET',
        url: '/coinPerPage',
        roles: ['*'],
        schema: {
            summary: '',
            description: '',
            response: {
                200: CoinPerPageDto
            }
        },
        handler: configurationHandler.getCoinPerPage
    },
    {
        method: 'GET',
        url: '/coinPerSem',
        roles: ['*'],
        schema: {
            summary: '',
            description: '',
            response: {
                200: CoinPerSemDto
            }
        },
        handler: configurationHandler.getCoinPerSem
    },
    {
        method: 'GET',
        url: '/dollarToCoin',
        roles: ['*'],
        schema: {
            summary: '',
            description: '',
            response: {
                200: DollarToCoinDto
            },
            deprecated: true
        },
        handler: configurationHandler.getDollarToCoin
    },
    {
        method: 'GET',
        url: '/coinToVnd',
        roles: ['*'],
        schema: {
            summary: '',
            description: '',
            response: {
                200: CoinToVNDDto
            }
        },
        handler: configurationHandler.getCoinToVnd
    },
    {
        method: 'GET',
        url: '/bonusCoinPer100000Vnd',
        roles: ['*'],
        schema: {
            summary: '',
            description: '',
            response: {
                200: BonusCoinPer100000VndDto
            }
        },
        handler: configurationHandler.bonusCoinPer100000Vnd
    },
    {
        method: 'GET',
        url: '/maxFileSize',
        roles: ['*'],
        schema: {
            summary: '',
            description: '',
            response: {
                200: MaxFileSizeDto
            }
        },
        handler: configurationHandler.getMaxFileSizeDto
    },
    {
        method: 'PUT',
        url: '/',
        roles: [USER_ROLES.admin],
        schema: {
            summary: 'Update list accepted extensions',
            description: 'Update accepted extensions of printing file',
            body: updateAcceptedExtensionDto,
            response: {
                200: AcceptedExtensionDto
            }
        },
        handler: configurationHandler.updateAcceptedExtension
    }
]);
