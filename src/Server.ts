import fastify, { FastifyInstance } from 'fastify';
import type { FastifyCookieOptions } from '@fastify/cookie';
import { CORS_WHITE_LIST, customErrorHandler, envs, loggerConfig, swaggerConfig, swaggerUIConfig } from '@configs';
import { apiPlugin, authPlugin } from './routes';
import { checkRoles } from '@hooks';

export function createServer(config: ServerConfig): FastifyInstance {
    const app = fastify({ logger: loggerConfig[envs.NODE_ENV], ajv: { plugins: [require('@fastify/multipart').ajvFilePlugin] } });

    app.register(import('@fastify/cors'), {
        origin: CORS_WHITE_LIST,
        credentials: true
    });
    app.register(import('@fastify/sensible'));
    app.register(import('@fastify/helmet'));

    app.register(import('@fastify/cookie'), {
        secret: envs.COOKIE_SECRET, // for cookies signature
        hook: 'onRequest'
    } as FastifyCookieOptions);

    app.register(import('@fastify/multipart'), { attachFieldsToBody: true });

    app.register(import('@fastify/swagger'), swaggerConfig);
    app.register(import('@fastify/swagger-ui'), swaggerUIConfig);

    app.decorate('checkRoles', checkRoles);
    app.decorate('roles', []);

    app.register(authPlugin, { prefix: '/auth' });
    app.register(apiPlugin, { prefix: '/api' });

    app.setErrorHandler(customErrorHandler);

    const shutdown = async () => {
        await app.close();
    };

    const start = async () => {
        await app.listen({
            host: config.host,
            port: config.port
        });
        await app.ready();
        if (!envs.isProd) {
            app.swagger({ yaml: true });
            app.log.info(`Swagger documentation is on http://${config.host}:${config.port}/docs`);
        }
    };

    return {
        ...app,
        start,
        shutdown
    };
}
