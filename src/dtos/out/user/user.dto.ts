import { ObjectId } from '@dtos/common';
import { Static, Type } from '@sinclair/typebox';

export const UserDto = Type.Object({
    id: ObjectId,
    userName: Type.String({ format: 'userName' })
});

export type UserDto = Static<typeof UserDto>;
