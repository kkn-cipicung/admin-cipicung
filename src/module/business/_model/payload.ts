import { z } from 'zod';
import { PaginationParamsSchema } from '../../../utils/types';

export const CreateBusinessPayloadSchema = z.object({
	category_id: z.number(),
	owner_name: z.string(),
	business_name: z.string(),
	description: z.string(),
	phone: z.string(),
	address: z.string(),
	instagram: z.string().nullable().optional(),
	facebook: z.string().nullable().optional()
});
export type CreateBusinessPayload = z.infer<typeof CreateBusinessPayloadSchema>;

export const ListBusinessPayloadSchema = PaginationParamsSchema.extend({
	type: z.string().optional()
});
export type ListBusinessPayload = z.infer<typeof ListBusinessPayloadSchema>;

export const FindBusinessPayloadSchema = z.object({
	id: z.number()
});
export type FindBusinessPayload = z.infer<typeof FindBusinessPayloadSchema>;

export const UpdateBusinessPayloadSchema = z.object({
	id: z.number(),
	category_id: z.number(),
	owner_name: z.string().optional(),
	business_name: z.string().optional(),
	description: z.string().optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
	instagram: z.string().nullable().optional(),
	facebook: z.string().nullable().optional()
});
export type UpdateBusinessPayload = z.infer<typeof UpdateBusinessPayloadSchema>;

export const DeleteBusinessPayloadSchema = z.object({
	id: z.number()
});
export type DeleteBusinessPayload = z.infer<typeof DeleteBusinessPayloadSchema>;
