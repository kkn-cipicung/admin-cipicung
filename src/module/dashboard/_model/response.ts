import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';

export const DashboardDataSchema = z.object({
	id: z.number(),
	creator: z.object({ id: z.number(), name: z.string() }),
	category: z.object({ id: z.number(), name: z.string() }),
	title: z.string(),
	description: z.string(),
	media_id: z.number().nullable(),
	is_active: z.boolean(),
	created_at: z.string()
});
export type DashboardData = z.infer<typeof DashboardDataSchema>;

export const CreateDashboardResponseSchema = BaseResponseSchema(z.null());
export type CreateDashboardResponse = z.infer<typeof CreateDashboardResponseSchema>;

export const ListDashboardResponseSchema = BaseResponseSchema(z.array(DashboardDataSchema));
export type ListDashboardResponse = z.infer<typeof ListDashboardResponseSchema>;

export const FindDashboardResponseSchema = BaseResponseSchema(DashboardDataSchema);
export type FindDashboardResponse = z.infer<typeof FindDashboardResponseSchema>;

export const UpdateDashboardResponseSchema = BaseResponseSchema(z.null());
export type UpdateDashboardResponse = z.infer<typeof UpdateDashboardResponseSchema>;

export const DeleteDashboardResponseSchema = BaseResponseSchema(z.null());
export type DeleteDashboardResponse = z.infer<typeof DeleteDashboardResponseSchema>;

export const ActivateDashboardResponseSchema = BaseResponseSchema(z.null());
export type ActivateDashboardResponse = z.infer<typeof ActivateDashboardResponseSchema>;
