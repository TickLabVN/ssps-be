import { USER_ROLES } from '@constants';
import { AuthInputDto, SignUpRequestDto } from '@dtos/in';
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
            body: SignUpRequestDto,
            response: {
                200: AuthResultDto
            }
        },
        handler: authHandler.signup
    },
    {
        method: 'POST',
        url: '/google',
        roles: ['*'],
        schema: {
            summary: 'Redirect URL of google auth'
        },
        handler: authHandler.googleOAuth
    }
]);
