import { Static, Type } from '@sinclair/typebox';

export const RemainCoinDto = Type.Number();

export type RemainCoinDto = Static<typeof RemainCoinDto>;
