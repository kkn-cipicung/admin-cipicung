import { z } from 'zod';
import { PaginationParamsSchema } from '../../../utils/types';

export const CategoryTypeSchema = z.enum(['news', 'document', 'business', 'potential']);
export type CategoryType = z.infer<typeof CategoryTypeSchema>;

export const CreateCategoryPayloadSchema = z.object({
	name: z.string(),
	type: CategoryTypeSchema
});
export type CreateCategoryPayload = z.infer<typeof CreateCategoryPayloadSchema>;

export const ListCategoryPayloadSchema = PaginationParamsSchema.extend({
	type: CategoryTypeSchema.optional()
});
export type ListCategoryPayload = z.infer<typeof ListCategoryPayloadSchema>;

export const FindCategoryPayloadSchema = z.object({
	id: z.number()
});
export type FindCategoryPayload = z.infer<typeof FindCategoryPayloadSchema>;

export const UpdateCategoryPayloadSchema = z.object({
	id: z.number(),
	name: z.string(),
	type: CategoryTypeSchema
});
export type UpdateCategoryPayload = z.infer<typeof UpdateCategoryPayloadSchema>;

export const DeleteCategoryPayloadSchema = z.object({
	id: z.number()
});
export type DeleteCategoryPayload = z.infer<typeof DeleteCategoryPayloadSchema>;
