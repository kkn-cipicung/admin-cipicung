import { z } from 'zod';
import { PaginationParamsSchema } from '../../../utils/types';

export const CreateGalleryPayloadSchema = z.object({
	category_id: z.number(),
	title: z.string(),
	description: z.string(),
	media_id: z.string().nullable().optional()
});
export type CreateGalleryPayload = z.infer<typeof CreateGalleryPayloadSchema>;

export const ListGalleryPayloadSchema = PaginationParamsSchema;
export type ListGalleryPayload = z.infer<typeof ListGalleryPayloadSchema>;

export const FindGalleryPayloadSchema = z.object({ id: z.number() });
export type FindGalleryPayload = z.infer<typeof FindGalleryPayloadSchema>;

export const UpdateGalleryPayloadSchema = CreateGalleryPayloadSchema.extend({ id: z.number() });
export type UpdateGalleryPayload = z.infer<typeof UpdateGalleryPayloadSchema>;

export const DeleteGalleryPayloadSchema = z.object({ id: z.number() });
export type DeleteGalleryPayload = z.infer<typeof DeleteGalleryPayloadSchema>;
