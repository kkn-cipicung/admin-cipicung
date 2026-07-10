import { z } from 'zod';

export const RegisterPayloadSchema = z.object({
	name: z.string(),
	username: z.string(),
	password: z.string()
});
export type RegisterPayload = z.infer<typeof RegisterPayloadSchema>;

export const LoginPayloadSchema = z.object({
	username: z.string(),
	password: z.string()
});
export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
