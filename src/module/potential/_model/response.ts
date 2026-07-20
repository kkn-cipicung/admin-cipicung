import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';

export const PotentialDataSchema = z.object({
	id: z.number(),
	category: z.object({ id: z.number(), name: z.string() }),
	title: z.string(),
	subtitle: z.string().nullable(),
	slug: z.string(),
	description: z.string(),
	location: z.object({ id: z.number() }),
	owner: z.object({ name: z.string(), msisdn: z.string().nullable() }),
	media_id: z.number().nullable(),
	created_at: z.string()
});
export type PotentialData = z.infer<typeof PotentialDataSchema>;

export const CreatePotentialResponseSchema = BaseResponseSchema(z.null());
export type CreatePotentialResponse = z.infer<typeof CreatePotentialResponseSchema>;

export const ListPotentialResponseSchema = BaseResponseSchema(z.array(PotentialDataSchema));
export type ListPotentialResponse = z.infer<typeof ListPotentialResponseSchema>;

export const FindPotentialResponseSchema = BaseResponseSchema(PotentialDataSchema);
export type FindPotentialResponse = z.infer<typeof FindPotentialResponseSchema>;

export const UpdatePotentialResponseSchema = BaseResponseSchema(z.null());
export type UpdatePotentialResponse = z.infer<typeof UpdatePotentialResponseSchema>;

export const DeletePotentialResponseSchema = BaseResponseSchema(z.null());
export type DeletePotentialResponse = z.infer<typeof DeletePotentialResponseSchema>;
