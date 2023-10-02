import { verifyToken } from 'src/hooks';
import { FastifyInstance } from 'fastify';
import { userPlugin } from './user.plugin';
import { printingRequestPlugin } from './printingRequest.plugin';
import { homeRequestPlugin } from './homeSlide.plugin';

export async function apiPlugin(app: FastifyInstance) {
    app.addHook('onRequest', verifyToken);
    app.register(userPlugin, { prefix: '/user' });
    app.register(printingRequestPlugin, { prefix: '/printRequest' });
    app.register(homeRequestPlugin, { prefix: '/home' });
}
