import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';
import { CategoryTypeSchema } from './payload';

export const CategoryDataSchema = z.object({
	id: z.number(),
	name: z.string(),
	slug: z.string(),
	type: CategoryTypeSchema,
	created_at: z.string()
});
export type CategoryData = z.infer<typeof CategoryDataSchema>;

export const CreateCategoryResponseSchema = BaseResponseSchema(z.null());
export type CreateCategoryResponse = z.infer<typeof CreateCategoryResponseSchema>;

export const ListCategoryResponseSchema = BaseResponseSchema(z.array(CategoryDataSchema));
export type ListCategoryResponse = z.infer<typeof ListCategoryResponseSchema>;

export const FindCategoryResponseSchema = BaseResponseSchema(CategoryDataSchema);
export type FindCategoryResponse = z.infer<typeof FindCategoryResponseSchema>;

export const UpdateCategoryResponseSchema = BaseResponseSchema(z.null());
export type UpdateCategoryResponse = z.infer<typeof UpdateCategoryResponseSchema>;

export const DeleteCategoryResponseSchema = BaseResponseSchema(z.null());
export type DeleteCategoryResponse = z.infer<typeof DeleteCategoryResponseSchema>;
