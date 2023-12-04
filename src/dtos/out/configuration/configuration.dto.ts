import { Static, Type } from '@sinclair/typebox';

export const ConfigurationDto = Type.Array(
    Type.Object({
        name: Type.String(),
        value: Type.String(),
        description: Type.String()
    })
);

export type ConfigurationDto = Static<typeof ConfigurationDto>;
