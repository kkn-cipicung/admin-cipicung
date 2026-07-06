import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';

export const NewsDataSchema = z.object({
	id: z.number(),
	category_id: z.number(),
	uploaded_by: z.number(),
	title: z.string(),
	description: z.string(),
	created_at: z.string()
});
export type NewsData = z.infer<typeof NewsDataSchema>;

export const CreateNewsResponseSchema = BaseResponseSchema(z.null());
export type CreateNewsResponse = z.infer<typeof CreateNewsResponseSchema>;

export const ListNewsResponseSchema = BaseResponseSchema(z.array(NewsDataSchema));
export type ListNewsResponse = z.infer<typeof ListNewsResponseSchema>;

export const FindNewsResponseSchema = BaseResponseSchema(NewsDataSchema);
export type FindNewsResponse = z.infer<typeof FindNewsResponseSchema>;

export const FindNewsByDateResponseSchema = BaseResponseSchema(z.array(NewsDataSchema));
export type FindNewsByDateResponse = z.infer<typeof FindNewsByDateResponseSchema>;

export const UpdateNewsResponseSchema = BaseResponseSchema(z.null());
export type UpdateNewsResponse = z.infer<typeof UpdateNewsResponseSchema>;

export const DeleteNewsResponseSchema = BaseResponseSchema(z.null());
export type DeleteNewsResponse = z.infer<typeof DeleteNewsResponseSchema>;
