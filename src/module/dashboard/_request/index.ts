import api from '../../../lib/axios';
import type {
	CreateDashboardPayload,
	ListDashboardPayload,
	FindDashboardPayload,
	UpdateDashboardPayload,
	DeleteDashboardPayload
} from '../_model/payload';
import type {
	CreateDashboardResponse,
	ListDashboardResponse,
	FindDashboardResponse,
	UpdateDashboardResponse,
	DeleteDashboardResponse
} from '../_model/response';

export const createDashboard = async (
	payload: CreateDashboardPayload
): Promise<CreateDashboardResponse> => {
	const { data } = await api.post<CreateDashboardResponse>('/dashboard/create', payload);
	return data;
};

export const listDashboards = async (
	payload?: ListDashboardPayload
): Promise<ListDashboardResponse> => {
	const { data } = await api.post<ListDashboardResponse>('/dashboard/list', payload || {});
	return data;
};

export const findDashboardById = async (
	payload: FindDashboardPayload
): Promise<FindDashboardResponse> => {
	const { data } = await api.post<FindDashboardResponse>('/dashboard/detail', payload);
	return data;
};

export const updateDashboard = async (
	payload: UpdateDashboardPayload
): Promise<UpdateDashboardResponse> => {
	const { data } = await api.post<UpdateDashboardResponse>('/dashboard/update', payload);
	return data;
};

export const deleteDashboard = async (
	payload: DeleteDashboardPayload
): Promise<DeleteDashboardResponse> => {
	const { data } = await api.post<DeleteDashboardResponse>('/dashboard/delete', payload);
	return data;
};
