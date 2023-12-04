import { Static, Type } from '@sinclair/typebox';

export const AcceptedExtensionDto = Type.Array(Type.String());
export const ServiceFeeDto = Type.Number();
export const CoinPerPageDto = Type.Number();
export const CoinPerSemDto = Type.Number();
export const DollarToCoinDto = Type.Number();
export const CoinToVNDDto = Type.Number();
export const MaxFileSizeDto = Type.Number();

export type AcceptedExtensionDto = Static<typeof AcceptedExtensionDto>;
export type ServiceFeeDto = Static<typeof ServiceFeeDto>;
export type CoinPerPageDto = Static<typeof CoinPerPageDto>;
export type CoinPerSemDto = Static<typeof CoinPerSemDto>;
export type DollarToCoinDto = Static<typeof DollarToCoinDto>;
export type CoinToVNDDto = Static<typeof CoinToVNDDto>;
export type MaxFileSizeDto = Static<typeof MaxFileSizeDto>;
