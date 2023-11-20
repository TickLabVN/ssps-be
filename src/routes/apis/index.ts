import { verifyToken } from 'src/hooks';
import { FastifyInstance } from 'fastify';
import { userPlugin } from './user.plugin';
import { printingRequestPlugin } from './printingRequest.plugin';
import { homeRequestPlugin } from './homeSlide.plugin';
import { coinPlugin } from './checkout.plugin';
import { configurationPlugin } from './configuration.plugin';

export async function apiPlugin(app: FastifyInstance) {
    app.addHook('onRequest', verifyToken);
    app.register(coinPlugin, { prefix: '/coin' });
    app.register(configurationPlugin, { prefix: '/configuration' });
    app.register(homeRequestPlugin, { prefix: '/home' });
    app.register(printingRequestPlugin, { prefix: '/printRequest' });
    app.register(userPlugin, { prefix: '/user' });
}
