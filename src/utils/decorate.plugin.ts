import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const decorateRequestWithRoles: FastifyPluginCallback = (fastify, _opts, done) => {
    fastify.decorateRequest('roles', []);
    done();
};

export const addRolesHeader = fp(decorateRequestWithRoles, {
    name: 'decorateRequestWithRoles'
});
