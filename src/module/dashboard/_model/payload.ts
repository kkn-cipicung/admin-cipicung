import { z } from 'zod';
import { PaginationParamsSchema } from '../../../utils/types';

export const CreateDashboardPayloadSchema = z.object({
	category_id: z.number(),
	title: z.string(),
	description: z.string(),
	media_id: z.string().nullable().optional()
});
export type CreateDashboardPayload = z.infer<typeof CreateDashboardPayloadSchema>;

export const ListDashboardPayloadSchema = PaginationParamsSchema;
export type ListDashboardPayload = z.infer<typeof ListDashboardPayloadSchema>;

export const FindDashboardPayloadSchema = z.object({
	id: z.number()
});
export type FindDashboardPayload = z.infer<typeof FindDashboardPayloadSchema>;

export const UpdateDashboardPayloadSchema = z.object({
	id: z.number(),
	category_id: z.number(),
	title: z.string(),
	description: z.string(),
	media_id: z.string().nullable().optional(),
	is_active: z.boolean().optional()
});
export type UpdateDashboardPayload = z.infer<typeof UpdateDashboardPayloadSchema>;

export const DeleteDashboardPayloadSchema = z.object({
	id: z.number()
});
export type DeleteDashboardPayload = z.infer<typeof DeleteDashboardPayloadSchema>;

export const ActivateDashboardPayloadSchema = z.object({
	id: z.number()
});
export type ActivateDashboardPayload = z.infer<typeof ActivateDashboardPayloadSchema>;
