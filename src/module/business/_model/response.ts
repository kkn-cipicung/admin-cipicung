import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';

export const BusinessDataSchema = z.object({
	id: z.number(),
	category_id: z.number(),
	category_name: z.string().optional(),
	owner_name: z.string(),
	business_name: z.string(),
	description: z.string(),
	phone: z.string(),
	address: z.string(),
	instagram: z.string().nullable().optional(),
	facebook: z.string().nullable().optional(),
	created_at: z.string().optional()
});
export type BusinessData = z.infer<typeof BusinessDataSchema>;

export const CreateBusinessResponseSchema = BaseResponseSchema(z.null());
export type CreateBusinessResponse = z.infer<typeof CreateBusinessResponseSchema>;

export const ListBusinessResponseSchema = BaseResponseSchema(z.array(BusinessDataSchema));
export type ListBusinessResponse = z.infer<typeof ListBusinessResponseSchema>;

export const FindBusinessResponseSchema = BaseResponseSchema(BusinessDataSchema);
export type FindBusinessResponse = z.infer<typeof FindBusinessResponseSchema>;

export const UpdateBusinessResponseSchema = BaseResponseSchema(z.null());
export type UpdateBusinessResponse = z.infer<typeof UpdateBusinessResponseSchema>;

export const DeleteBusinessResponseSchema = BaseResponseSchema(z.null());
export type DeleteBusinessResponse = z.infer<typeof DeleteBusinessResponseSchema>;
