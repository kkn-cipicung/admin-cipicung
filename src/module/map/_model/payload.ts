import { z } from 'zod';

export const MapPayloadSchema = z.object({
	elevation: z.string(),
	coordinate: z.string(),
	hamlet_one: z.number(),
	hamlet_two: z.number()
});
export type CreateMapPayload = z.infer<typeof MapPayloadSchema>;
export const UpdateMapPayloadSchema = MapPayloadSchema.extend({
	id: z.number()
});
export type UpdateMapPayload = z.infer<typeof UpdateMapPayloadSchema>;
export const MapIdPayloadSchema = z.object({ id: z.number() });
export type MapIdPayload = z.infer<typeof MapIdPayloadSchema>;
