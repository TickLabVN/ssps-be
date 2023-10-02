// import { USER_ROLES } from '@constants';
import { USER_ROLES } from '@constants';
import { FastifyInstance, RouteOptions } from 'fastify';

export function createRoutes(swaggerTag: HandlerTag, routesOptions: RouteOptions[]) {
    return async function (app: FastifyInstance) {
        routesOptions.forEach((options) => {
            const { roles, ...remainOptions } = options;

            const preValidation = roles ? (roles.includes('*') ? null : app.checkRoles(roles)) : app.checkRoles([USER_ROLES.admin]);

            const preValidationArray = preValidation ? { preValidation } : {};

            app.route({
                ...remainOptions,
                ...preValidationArray,
                schema: {
                    ...options.schema,
                    tags: [swaggerTag]
                },
                /**
                 * True by default. See https://www.fastify.dev/docs/latest/Reference/Server/#exposeHeadRoutes
                 * About HEAD http method: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD
                 */
                exposeHeadRoute: false
            });
        });
    };
}
