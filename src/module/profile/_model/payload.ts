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
	total_family: z.number().optional(),
	hamlet_one: z.number().optional(),
	hamlet_two: z.number().optional(),
	rt_hamlet_one: z.number().optional(),
	rt_hamlet_two: z.number().optional(),
	rw_hamlet_one: z.number().optional(),
	rw_hamlet_two: z.number().optional(),
	north_border: z.string().optional(),
	east_border: z.string().optional(),
	south_border: z.string().optional(),
	west_border: z.string().optional(),
	area: z.string().optional(),
	total_male: z.number().optional(),
	total_female: z.number().optional(),
	demographic_religions: z
		.array(z.object({ label: z.string(), value: z.number(), color: z.string().optional() }))
		.optional(),
	demographic_religion_rt: z
		.array(z.object({ label: z.string(), value: z.number(), value2: z.number().optional() }))
		.optional(),
	demographic_education: z
		.array(z.object({ label: z.string(), male: z.number(), female: z.number() }))
		.optional(),
	demographic_occupation: z
		.array(z.object({ label: z.string(), male: z.number(), female: z.number() }))
		.optional(),
	demographic_ages: z.array(z.object({ label: z.string(), value: z.number() })).optional(),
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

export const OfficialPayloadSchema = z.object({
	id: z.number().optional(),
	village_id: z.number().optional(),
	name: z.string(),
	position: z.string(),
	order_number: z.number().optional(),
	is_active: z.boolean().optional()
});
export type CreateOfficialPayload = z.infer<typeof OfficialPayloadSchema>;
export type UpdateOfficialPayload = z.infer<typeof OfficialPayloadSchema>;
