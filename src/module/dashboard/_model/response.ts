import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';

export const DashboardDataSchema = z.object({
	id: z.number(),
	creator: z.object({ id: z.number(), name: z.string() }),
	category: z.object({ id: z.number(), name: z.string() }),
	title: z.string(),
	description: z.string(),
	media: z.string().optional().nullable(),
	media_id: z.union([z.number(), z.string()]).optional().nullable(),
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

export const DashboardOverviewDataSchema = z.object({
	title: z.string(),
	description: z.string(),
	media: z.string().optional().nullable(),
	area: z.string(),
	population: z.number(),
	total_family: z.number(),
	total_hamlet: z.number(),
	total_news: z.number(),
	total_potential: z.number()
});
export type DashboardOverviewData = z.infer<typeof DashboardOverviewDataSchema>;

export const CreateDashboardOverviewResponseSchema = BaseResponseSchema(
	DashboardOverviewDataSchema
);
export type CreateDashboardOverviewResponse = z.infer<typeof CreateDashboardOverviewResponseSchema>;

export const FindDashboardOverviewResponseSchema = BaseResponseSchema(DashboardOverviewDataSchema);
export type FindDashboardOverviewResponse = z.infer<typeof FindDashboardOverviewResponseSchema>;
