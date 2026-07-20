import { z } from 'zod';

export const ContactPayloadSchema = z.object({
	name: z.string(),
	province: z.string(),
	regency: z.string(),
	district: z.string(),
	address: z.string(),
	postal_code: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().optional()
});
export type CreateContactPayload = z.infer<typeof ContactPayloadSchema>;
export const UpdateContactPayloadSchema = ContactPayloadSchema.extend({ id: z.number() });
export type UpdateContactPayload = z.infer<typeof UpdateContactPayloadSchema>;
export const ContactIdPayloadSchema = z.object({ id: z.number() });
export type ContactIdPayload = z.infer<typeof ContactIdPayloadSchema>;
