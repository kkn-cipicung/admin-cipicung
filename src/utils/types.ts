import { z } from 'zod';

export const BaseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		message: z.string(),
		data: dataSchema
	});

export type BaseResponse<T = any> = {
	message: string;
	data: T;
};

export const ErrorResponseSchema = z.object({
	message: z.string(),
	error: z.string().nullable().optional()
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const PaginationParamsSchema = z.object({
	limit: z.number().optional(),
	index: z.number().optional()
});
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
