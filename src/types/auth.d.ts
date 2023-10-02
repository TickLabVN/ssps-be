import { USER_ROLES } from '@constants';
import { preValidationHookHandler } from 'fastify';

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

type RolesValidation = (roles: (UserRole | '*')[]) => preValidationHookHandler;
