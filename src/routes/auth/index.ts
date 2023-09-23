import { USER_ROLES } from '@constants';
import { AuthInputDto } from '@dtos/in';
import { AuthResultDto } from '@dtos/out';
import { authHandler } from '@handlers';
import { createRoutes } from '@utils';

export const authPlugin = createRoutes('Auth', [
    {
        method: 'POST',
        url: '/login',
        roles: ['*'],
        schema: {
            body: AuthInputDto,
            response: {
                200: AuthResultDto
            }
        },
        handler: authHandler.login
    },
    {
        method: 'POST',
        url: '/signup',
        roles: [USER_ROLES.admin],
        schema: {
            body: AuthInputDto,
            response: {
                200: AuthResultDto
            }
        },
        handler: authHandler.signup
    }
]);
