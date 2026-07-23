import { z } from 'zod';

export const HeadmanPayloadSchema = z.object({
	name: z.string(),
	position: z.string().optional(),
	start_date: z.string().optional(),
	finish_date: z.string().nullable().optional(),
	is_active: z.boolean().optional()
});

export const ProfilePayloadSchema = z.object({
	name: z.string(),
	province: z.string(),
	regency: z.string(),
	district: z.string(),
	address: z.string(),
	postal_code: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().optional(),
	website: z.string().optional(),
	vision: z.string().optional(),
	history: z.string().optional(),
	description: z.string().optional(),
	region: z.string().optional(),
	hamlet_one: z.number().optional(),
	hamlet_two: z.number().optional(),
	north_border: z.string().optional(),
	east_border: z.string().optional(),
	south_border: z.string().optional(),
	west_border: z.string().optional(),
	area: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	mission: z.array(z.string()).optional(),
	headmen: z.array(HeadmanPayloadSchema).optional()
});
export type CreateProfilePayload = z.infer<typeof ProfilePayloadSchema>;
export const UpdateProfilePayloadSchema = ProfilePayloadSchema;
export type UpdateProfilePayload = z.infer<typeof UpdateProfilePayloadSchema>;
export const ProfileIdPayloadSchema = z.object({
	id: z.number()
});
export type ProfileIdPayload = z.infer<typeof ProfileIdPayloadSchema>;
