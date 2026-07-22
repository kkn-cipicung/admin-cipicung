import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';

export const MapDataSchema = z.object({
	id: z.number().optional(),
	elevation: z.string(),
	coordinate: z.string(),
	hamlet_one: z.number(),
	hamlet_two: z.number(),
	population: z.number().optional(),
	is_active: z.boolean().optional()
});
export type MapData = z.infer<typeof MapDataSchema>;

export const MapResponseSchema = BaseResponseSchema(MapDataSchema);
export type MapResponse = z.infer<typeof MapResponseSchema>;
export const MapListResponseSchema = BaseResponseSchema(z.array(MapDataSchema));
export type MapListResponse = z.infer<typeof MapListResponseSchema>;
export const EmptyMapResponseSchema = BaseResponseSchema(z.null());
export type EmptyMapResponse = z.infer<typeof EmptyMapResponseSchema>;
