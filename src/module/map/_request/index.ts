import api from '../../../lib/axios';
import type { CreateMapPayload, MapIdPayload, UpdateMapPayload } from '../_model/payload';
import type { EmptyMapResponse, MapListResponse, MapResponse } from '../_model/response';

export const createMap = async (payload: CreateMapPayload): Promise<EmptyMapResponse> =>
	(await api.post<EmptyMapResponse>('/map/create', payload)).data;
export const getActiveMap = async (): Promise<MapResponse> =>
	(await api.post<MapResponse>('/map/main', {})).data;
export const listMaps = async (): Promise<MapListResponse> =>
	(await api.post<MapListResponse>('/map/list', {})).data;
export const updateMap = async (payload: UpdateMapPayload): Promise<EmptyMapResponse> =>
	(await api.post<EmptyMapResponse>('/map/update', payload)).data;
export const deleteMap = async (payload: MapIdPayload): Promise<EmptyMapResponse> =>
	(await api.post<EmptyMapResponse>('/map/delete', payload)).data;
