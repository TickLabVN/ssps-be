import { FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';
import { UserRole } from 'src/types/auth';

export type Handler<RS = unknown, RQ extends RouteGenericInterface = Record<string, never>> = (
    req: FastifyRequest<RQ> & { userId: string } & { roles: UserRole[] },
    res: FastifyReply
) => Result<RS>;
