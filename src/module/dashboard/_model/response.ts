import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';

export const DashboardDataSchema = z.object({
	id: z.number(),
	created_by: z.number(),
	creator_name: z.string().optional(),
	category_id: z.number(),
	category_name: z.string().optional(),
	title: z.string(),
	description: z.string(),
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
