import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';

export const LoginResponseDataSchema = z.object({
	access_token: z.string()
});
export type LoginResponseData = z.infer<typeof LoginResponseDataSchema>;

export const RegisterResponseSchema = BaseResponseSchema(z.null());
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

export const LoginResponseSchema = BaseResponseSchema(LoginResponseDataSchema);
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
