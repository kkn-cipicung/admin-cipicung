import api from '../../../utils/axios';
import type {
	CreatePotentialPayload,
	ListPotentialPayload,
	FindPotentialPayload,
	UpdatePotentialPayload,
	DeletePotentialPayload
} from '../_model/payload';
import type {
	CreatePotentialResponse,
	ListPotentialResponse,
	FindPotentialResponse,
	UpdatePotentialResponse,
	DeletePotentialResponse
} from '../_model/response';

export const createPotential = async (payload: CreatePotentialPayload): Promise<CreatePotentialResponse> => {
	const { data } = await api.post<CreatePotentialResponse>('/potential/create', payload);
	return data;
};

export const listPotentials = async (payload?: ListPotentialPayload): Promise<ListPotentialResponse> => {
	const { data } = await api.post<ListPotentialResponse>('/potential/list', payload || {});
	return data;
};

export const findPotentialById = async (payload: FindPotentialPayload): Promise<FindPotentialResponse> => {
	const { data } = await api.post<FindPotentialResponse>('/potential/find', payload);
	return data;
};

export const updatePotential = async (payload: UpdatePotentialPayload): Promise<UpdatePotentialResponse> => {
	const { data } = await api.post<UpdatePotentialResponse>('/potential/update', payload);
	return data;
};

export const deletePotential = async (payload: DeletePotentialPayload): Promise<DeletePotentialResponse> => {
	const { data } = await api.post<DeletePotentialResponse>('/potential/delete', payload);
	return data;
};
