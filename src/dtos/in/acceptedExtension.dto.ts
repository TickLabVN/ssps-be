import { Static, Type } from '@sinclair/typebox';

// See https://github.com/sinclairzx81/typebox

export const updateAcceptedExtensionDto = Type.Object(
    {
        acceptedExtensions: Type.Array(Type.String())
    },
    {
        examples: [
            {
                acceptedExtensions: ['pdf', 'png']
            }
        ]
    }
);

export type updateAcceptedExtensionDto = Static<typeof updateAcceptedExtensionDto>;
