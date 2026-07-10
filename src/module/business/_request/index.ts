import api from '../../../lib/axios';
import type {
	CreateBusinessPayload,
	ListBusinessPayload,
	FindBusinessPayload,
	UpdateBusinessPayload,
	DeleteBusinessPayload
} from '../_model/payload';
import type {
	CreateBusinessResponse,
	ListBusinessResponse,
	FindBusinessResponse,
	UpdateBusinessResponse,
	DeleteBusinessResponse
} from '../_model/response';

export const createBusiness = async (
	payload: CreateBusinessPayload
): Promise<CreateBusinessResponse> => {
	const { data } = await api.post<CreateBusinessResponse>('/business/create', payload);
	return data;
};

export const listBusinesses = async (
	payload?: ListBusinessPayload
): Promise<ListBusinessResponse> => {
	const { data } = await api.post<ListBusinessResponse>('/business/list', payload || {});
	return data;
};

export const findBusinessById = async (
	payload: FindBusinessPayload
): Promise<FindBusinessResponse> => {
	const { data } = await api.post<FindBusinessResponse>('/business/detail', payload);
	return data;
};

export const updateBusiness = async (
	payload: UpdateBusinessPayload
): Promise<UpdateBusinessResponse> => {
	const { data } = await api.post<UpdateBusinessResponse>('/business/update', payload);
	return data;
};

export const deleteBusiness = async (
	payload: DeleteBusinessPayload
): Promise<DeleteBusinessResponse> => {
	const { data } = await api.post<DeleteBusinessResponse>('/business/delete', payload);
	return data;
};
