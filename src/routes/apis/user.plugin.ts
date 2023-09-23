import { UserDto } from '@dtos/out';
import { usersHandler } from '@handlers';
import { createRoutes } from '@utils';

export const userPlugin = createRoutes('User', [
    {
        method: 'GET',
        url: '',
        roles: ['*'],
        schema: {
            response: {
                200: UserDto
            }
        },
        handler: usersHandler.getUserById
    }
]);
