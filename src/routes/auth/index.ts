import { USER_ROLES } from '@constants';
import { AuthInputDto, SignUpRequestDto } from '@dtos/in';
import { AuthResultDto } from '@dtos/out';
import { authHandler } from '@handlers';
import { Type } from '@sinclair/typebox';
import { createRoutes } from '@utils';

export const authPlugin = createRoutes('Auth', [
    {
        method: 'GET',
        url: '/google',
        roles: ['*'],
        schema: {
            summary: 'Redirect URL of google auth',
            response: {
                200: AuthResultDto
            }
        },
        handler: authHandler.googleOAuth
    },
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
        method: 'DELETE',
        url: '/logout',
        roles: ['*'],
        schema: {
            response: {
                200: Type.Null()
            }
        },
        handler: authHandler.logout
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
    }
]);
