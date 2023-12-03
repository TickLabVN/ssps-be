import 'fastify';
import { RolesValidation, UserRole } from './types/auth';

declare module 'fastify' {
    interface FastifyRequest {
        userId: string;
        roles: UserRole[];
    }
    interface FastifyInstance {
        start: () => Promise<void>;
        shutdown: () => Promise<void>;
        checkRoles: RolesValidation;
    }

    interface RouteOptions {
        roles?: (UserRole | '*')[];
    }
}
