import { z } from 'zod';
import { PaginationParamsSchema } from '../../../utils/types';

export const CreatePotentialPayloadSchema = z.object({
	uploaded_by: z.number(),
	category_id: z.number(),
	title: z.string(),
	subtitle: z.string(),
	slug: z.string(),
	description: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	owner_name: z.string(),
	owner_msisdn: z.string(),
	img_id: z.string().optional()
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
	subtitle: z.string(),
	slug: z.string(),
	description: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	owner_name: z.string(),
	owner_msisdn: z.string(),
	img_id: z.string().optional()
});
export type UpdatePotentialPayload = z.infer<typeof UpdatePotentialPayloadSchema>;

export const DeletePotentialPayloadSchema = z.object({
	id: z.number()
});
export type DeletePotentialPayload = z.infer<typeof DeletePotentialPayloadSchema>;
