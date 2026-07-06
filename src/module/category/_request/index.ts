import api from '../../../utils/axios';
import type {
	CreateCategoryPayload,
	ListCategoryPayload,
	FindCategoryPayload,
	UpdateCategoryPayload,
	DeleteCategoryPayload
} from '../_model/payload';
import type {
	CreateCategoryResponse,
	ListCategoryResponse,
	FindCategoryResponse,
	UpdateCategoryResponse,
	DeleteCategoryResponse
} from '../_model/response';

export const createCategory = async (payload: CreateCategoryPayload): Promise<CreateCategoryResponse> => {
	const { data } = await api.post<CreateCategoryResponse>('/category/create', payload);
	return data;
};

export const listCategories = async (payload?: ListCategoryPayload): Promise<ListCategoryResponse> => {
	const { data } = await api.post<ListCategoryResponse>('/category/list', payload || {});
	return data;
};

export const findCategoryById = async (payload: FindCategoryPayload): Promise<FindCategoryResponse> => {
	const { data } = await api.post<FindCategoryResponse>('/category/find', payload);
	return data;
};

export const updateCategory = async (payload: UpdateCategoryPayload): Promise<UpdateCategoryResponse> => {
	const { data } = await api.post<UpdateCategoryResponse>('/category/update', payload);
	return data;
};

export const deleteCategory = async (payload: DeleteCategoryPayload): Promise<DeleteCategoryResponse> => {
	const { data } = await api.post<DeleteCategoryResponse>('/category/delete', payload);
	return data;
};
