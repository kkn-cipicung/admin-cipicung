import api from '../../../lib/axios';
import type {
	CreateNewsPayload,
	ListNewsPayload,
	FindNewsPayload,
	FindNewsByDatePayload,
	UpdateNewsPayload,
	DeleteNewsPayload
} from '../_model/payload';
import type {
	CreateNewsResponse,
	ListNewsResponse,
	FindNewsResponse,
	FindNewsByDateResponse,
	NewsHeaderResponse,
	UpdateNewsResponse,
	DeleteNewsResponse
} from '../_model/response';

export const createNews = async (payload: CreateNewsPayload): Promise<CreateNewsResponse> => {
	const { data } = await api.post<CreateNewsResponse>('/news/create', payload);
	return data;
};

export const listNews = async (payload?: ListNewsPayload): Promise<ListNewsResponse> => {
	const { data } = await api.post<ListNewsResponse>('/news/list', payload || {});
	return data;
};

export const findNewsById = async (payload: FindNewsPayload): Promise<FindNewsResponse> => {
	const { data } = await api.post<FindNewsResponse>('/news/detail', payload);
	return data;
};

export const findNewsByDate = async (
	payload: FindNewsByDatePayload
): Promise<FindNewsByDateResponse> => {
	const { data } = await api.post<FindNewsByDateResponse>('/news/find-by-date', payload);
	return data;
};

export const getNewsHeader = async (payload: FindNewsPayload): Promise<NewsHeaderResponse> => {
	const { data } = await api.post<NewsHeaderResponse>('/news/header', payload);
	return data;
};

export const updateNews = async (payload: UpdateNewsPayload): Promise<UpdateNewsResponse> => {
	const { data } = await api.post<UpdateNewsResponse>('/news/update', payload);
	return data;
};

export const deleteNews = async (payload: DeleteNewsPayload): Promise<DeleteNewsResponse> => {
	const { data } = await api.post<DeleteNewsResponse>('/news/delete', payload);
	return data;
};
