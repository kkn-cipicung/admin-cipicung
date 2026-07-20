import { z } from 'zod';
import { PaginationParamsSchema } from '../../../utils/types';

export const CreatePotentialPayloadSchema = z.object({
	category_id: z.number(),
	title: z.string(),
	subtitle: z.string().optional(),
	slug: z.string(),
	description: z.string(),
	location: z
		.object({
			latitude: z.number().optional(),
			longitude: z.number().optional(),
			title: z.string().optional(),
			description: z.string().optional()
		})
		.optional(),
	owner_name: z.string(),
	owner_msisdn: z.string().optional(),
	media_id: z.string().nullable().optional()
});
export type CreatePotentialPayload = z.infer<typeof CreatePotentialPayloadSchema>;

export const ListPotentialPayloadSchema = PaginationParamsSchema;
export type ListPotentialPayload = z.infer<typeof ListPotentialPayloadSchema>;

export const FindPotentialPayloadSchema = z.object({
	id: z.number()
});
export type FindPotentialPayload = z.infer<typeof FindPotentialPayloadSchema>;

export const UpdatePotentialPayloadSchema = z.object({
	id: z.number(),
	category_id: z.number(),
	title: z.string(),
	subtitle: z.string().optional(),
	slug: z.string(),
	description: z.string(),
	location: z
		.object({
			latitude: z.number().optional(),
			longitude: z.number().optional(),
			title: z.string().optional(),
			description: z.string().optional()
		})
		.optional(),
	owner_name: z.string(),
	owner_msisdn: z.string().optional(),
	media_id: z.string().nullable().optional()
});
export type UpdatePotentialPayload = z.infer<typeof UpdatePotentialPayloadSchema>;

export const DeletePotentialPayloadSchema = z.object({
	id: z.number()
});
export type DeletePotentialPayload = z.infer<typeof DeletePotentialPayloadSchema>;
