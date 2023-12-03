import { MIN_USERNAME_LENGTH, MIN_PASSWORD_LENGTH } from '@constants';
import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const SignUpRequestDto = Type.Object({
    userName: Type.String({ minLength: MIN_USERNAME_LENGTH, format: 'email' }),
    password: Type.String({ minLength: MIN_PASSWORD_LENGTH }),
    role: Type.Array(Type.Integer()),
    name: Type.String(),
    email: Type.String()
});

export type SignUpRequestDto = Static<typeof SignUpRequestDto>;
