import { z } from 'zod';
import { PaginationParamsSchema } from '../../../utils/types';

export const CreateNewsPayloadSchema = z.object({
	uploaded_by: z.number(),
	category_id: z.number(),
	title: z.string(),
	description: z.string(),
	img_id: z.string().optional()
});
export type CreateNewsPayload = z.infer<typeof CreateNewsPayloadSchema>;

export const ListNewsPayloadSchema = PaginationParamsSchema;
export type ListNewsPayload = z.infer<typeof ListNewsPayloadSchema>;

export const FindNewsPayloadSchema = z.object({
	id: z.number()
});
export type FindNewsPayload = z.infer<typeof FindNewsPayloadSchema>;

export const FindNewsByDatePayloadSchema = z.object({
	date: z.string() // Format YYYY-MM-DD
});
export type FindNewsByDatePayload = z.infer<typeof FindNewsByDatePayloadSchema>;

export const UpdateNewsPayloadSchema = z.object({
	id: z.number(),
	category_id: z.number(),
	title: z.string(),
	description: z.string(),
	img_id: z.string().optional()
});
export type UpdateNewsPayload = z.infer<typeof UpdateNewsPayloadSchema>;

export const DeleteNewsPayloadSchema = z.object({
	id: z.number()
});
export type DeleteNewsPayload = z.infer<typeof DeleteNewsPayloadSchema>;
