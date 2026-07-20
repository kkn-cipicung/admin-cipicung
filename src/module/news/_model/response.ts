import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';

export const NewsDataSchema = z.object({
	id: z.number(),
	category: z.object({ id: z.number(), name: z.string() }),
	uploader: z.object({ id: z.number(), name: z.string() }),
	title: z.string(),
	description: z.string(),
	media_id: z.number().nullable(),
	source: z.string(),
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

export const NewsHeaderDataSchema = z.object({
	id: z.number(),
	title: z.string()
});
export const NewsHeaderResponseSchema = BaseResponseSchema(NewsHeaderDataSchema);
export type NewsHeaderResponse = z.infer<typeof NewsHeaderResponseSchema>;

export const UpdateNewsResponseSchema = BaseResponseSchema(z.null());
export type UpdateNewsResponse = z.infer<typeof UpdateNewsResponseSchema>;

export const DeleteNewsResponseSchema = BaseResponseSchema(z.null());
export type DeleteNewsResponse = z.infer<typeof DeleteNewsResponseSchema>;
