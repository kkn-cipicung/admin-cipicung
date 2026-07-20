import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';

export const GalleryListItemSchema = z.object({
	id: z.number(),
	title: z.string(),
	image: z.string()
});
export type GalleryListItem = z.infer<typeof GalleryListItemSchema>;

export const GalleryDetailSchema = z.object({
	title: z.string(),
	image: z.string(),
	description: z.string(),
	category: z.array(z.object({ id: z.number(), name: z.string() }))
});
export type GalleryDetail = z.infer<typeof GalleryDetailSchema>;

export const CreateGalleryResponseSchema = BaseResponseSchema(z.null());
export type CreateGalleryResponse = z.infer<typeof CreateGalleryResponseSchema>;
export const ListGalleryResponseSchema = BaseResponseSchema(z.array(GalleryListItemSchema));
export type ListGalleryResponse = z.infer<typeof ListGalleryResponseSchema>;
export const FindGalleryResponseSchema = BaseResponseSchema(GalleryDetailSchema);
export type FindGalleryResponse = z.infer<typeof FindGalleryResponseSchema>;
export const UpdateGalleryResponseSchema = BaseResponseSchema(z.null());
export type UpdateGalleryResponse = z.infer<typeof UpdateGalleryResponseSchema>;
export const DeleteGalleryResponseSchema = BaseResponseSchema(z.null());
export type DeleteGalleryResponse = z.infer<typeof DeleteGalleryResponseSchema>;
