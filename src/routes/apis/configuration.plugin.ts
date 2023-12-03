import { USER_ROLES } from '@constants';
import { updateAcceptedExtensionDto } from '@dtos/in';
import { AcceptedExtensionDto, ConfigurationDto } from '@dtos/out';
import { configurationHandler } from '@handlers';
import { createRoutes } from '@utils';

export const configurationPlugin = createRoutes('Configuration', [
    {
        method: 'GET',
        url: '/',
        roles: ['*'],
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
