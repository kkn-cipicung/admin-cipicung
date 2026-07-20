import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';

export const ContactDetailSchema = z.object({
	office: z.object({
		name: z.string(),
		address: z.string(),
		district: z.string(),
		regency: z.string(),
		province: z.string(),
		postal_code: z.string()
	}),
	contact: z.object({
		email: z.string(),
		phone: z.string()
	}),
	social_media: z.array(z.object({ name: z.string(), username: z.string() })),
	service_hour: z.array(z.object({ day: z.string(), time: z.string() }))
});
export type ContactDetail = z.infer<typeof ContactDetailSchema>;
export const EmptyContactResponseSchema = BaseResponseSchema(z.null());
export type EmptyContactResponse = z.infer<typeof EmptyContactResponseSchema>;
export const ContactDetailResponseSchema = BaseResponseSchema(ContactDetailSchema);
export type ContactDetailResponse = z.infer<typeof ContactDetailResponseSchema>;
