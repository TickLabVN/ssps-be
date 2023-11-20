import { Static, Type } from '@sinclair/typebox';

export const AcceptedExtensionDto = Type.Array(Type.String());

export type AcceptedExtensionDto = Static<typeof AcceptedExtensionDto>;
