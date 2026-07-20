import { z } from 'zod';

export const MapPayloadSchema = z.object({
	elevation: z.string(),
	coordinate: z.string(),
	hamlet_one: z.string(),
	hamlet_two: z.string()
});
export type CreateMapPayload = z.infer<typeof MapPayloadSchema>;
export const UpdateMapPayloadSchema = MapPayloadSchema;
export type UpdateMapPayload = z.infer<typeof UpdateMapPayloadSchema>;
export const MapIdPayloadSchema = z.object({ id: z.number() });
export type MapIdPayload = z.infer<typeof MapIdPayloadSchema>;
