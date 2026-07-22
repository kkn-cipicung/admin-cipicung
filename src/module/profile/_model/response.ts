import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';
import { ProfilePayloadSchema } from './payload';

export const ProfileDataSchema = ProfilePayloadSchema.extend({
	id: z.number(),
	headmen: z
		.array(
			z.object({
				id: z.number().optional(),
				name: z.string(),
				position: z.string().optional(),
				start_date: z.string().nullable().optional(),
				finish_date: z.string().nullable().optional(),
				is_active: z.boolean().optional()
			})
		)
		.optional(),
	headman: z
		.object({
			id: z.number().optional(),
			name: z.string(),
			position: z.string().optional(),
			phone: z.string().optional(),
			email: z.string().optional(),
			description: z.string().optional(),
			order_number: z.number().optional(),
			is_active: z.boolean().optional()
		})
		.nullable()
		.optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional()
});
export type ProfileData = z.infer<typeof ProfileDataSchema>;
export const EmptyProfileResponseSchema = BaseResponseSchema(z.null());
export type EmptyProfileResponse = z.infer<typeof EmptyProfileResponseSchema>;
export const ProfileResponseSchema = BaseResponseSchema(ProfileDataSchema);
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
export const RegionBoundaryResponseSchema = BaseResponseSchema(
	z.object({
		region: z.string(),
		hamlet_one: z.union([z.number(), z.string()]),
		hamlet_two: z.union([z.number(), z.string()]),
		north_border: z.string(),
		east_border: z.string(),
		south_border: z.string(),
		west_border: z.string(),
		area: z.string(),
		population: z.string().optional()
	})
);
export type RegionBoundaryResponse = z.infer<typeof RegionBoundaryResponseSchema>;
export const VisionMissionResponseSchema = BaseResponseSchema(
	z.object({ vision: z.string(), mission: z.array(z.string()) })
);
export type VisionMissionResponse = z.infer<typeof VisionMissionResponseSchema>;
export const GovernmentStructureResponseSchema = BaseResponseSchema(
	z.array(z.object({ name: z.string(), position: z.string() }))
);
export type GovernmentStructureResponse = z.infer<typeof GovernmentStructureResponseSchema>;
export const ResourcePotentialResponseSchema = BaseResponseSchema(
	z.object({ title: z.string(), detail: z.string() })
);
export type ResourcePotentialResponse = z.infer<typeof ResourcePotentialResponseSchema>;
