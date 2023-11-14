import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const GoogleOAuthParamsDto = Type.Object({
    code: Type.String()
});

export type GoogleOAuthParamsDto = Static<typeof GoogleOAuthParamsDto>;
