import api from '../../../lib/axios';
import type {
	CreateGalleryPayload,
	DeleteGalleryPayload,
	FindGalleryPayload,
	ListGalleryPayload,
	UpdateGalleryPayload
} from '../_model/payload';
import type {
	CreateGalleryResponse,
	DeleteGalleryResponse,
	FindGalleryResponse,
	ListGalleryResponse,
	UpdateGalleryResponse
} from '../_model/response';

export const createGallery = async (
	payload: CreateGalleryPayload
): Promise<CreateGalleryResponse> =>
	(await api.post<CreateGalleryResponse>('/gallery/create', payload)).data;

export const listGalleries = async (payload?: ListGalleryPayload): Promise<ListGalleryResponse> =>
	(await api.post<ListGalleryResponse>('/gallery/list', payload || {})).data;

export const findGalleryById = async (payload: FindGalleryPayload): Promise<FindGalleryResponse> =>
	(await api.post<FindGalleryResponse>('/gallery/detail', payload)).data;

export const updateGallery = async (
	payload: UpdateGalleryPayload
): Promise<UpdateGalleryResponse> =>
	(await api.post<UpdateGalleryResponse>('/gallery/update', payload)).data;

export const deleteGallery = async (
	payload: DeleteGalleryPayload
): Promise<DeleteGalleryResponse> =>
	(await api.post<DeleteGalleryResponse>('/gallery/delete', payload)).data;
