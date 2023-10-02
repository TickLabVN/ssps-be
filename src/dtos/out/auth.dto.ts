import { ObjectId } from '@dtos/common';
import { Static, Type } from '@sinclair/typebox';

export const AuthResultDto = Type.Object({
    id: ObjectId,
    userName: Type.String({ format: 'userName' })
});

export type AuthResultDto = Static<typeof AuthResultDto>;
