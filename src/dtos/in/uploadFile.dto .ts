import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const UploadFileInputDto = Type.Object({
    file: Type.String(),
    config: Type.String()
});

export type UploadFileInputDto = Static<typeof UploadFileInputDto>;
