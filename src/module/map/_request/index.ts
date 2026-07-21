import api from '../../../lib/axios';
import type { CreateMapPayload, MapIdPayload, UpdateMapPayload } from '../_model/payload';
import type { EmptyMapResponse, MapResponse } from '../_model/response';

export const createMap = async (payload: CreateMapPayload): Promise<EmptyMapResponse> =>
	(await api.post<EmptyMapResponse>('/map/create', payload)).data;
// export const getMapDetail = async (): Promise<MapResponse> =>
// 	(await api.post<MapResponse>('/map/detail', {})).data;
export const getActiveMap = async (): Promise<MapResponse> =>
	(await api.post<MapResponse>('/map/active', {})).data;
export const updateMap = async (payload: UpdateMapPayload): Promise<EmptyMapResponse> =>
	(await api.post<EmptyMapResponse>('/map/update', payload)).data;
export const activateMap = async (payload: MapIdPayload): Promise<EmptyMapResponse> =>
	(await api.post<EmptyMapResponse>('/map/activate', payload)).data;
export const deleteMap = async (payload: MapIdPayload): Promise<EmptyMapResponse> =>
	(await api.post<EmptyMapResponse>('/map/delete', payload)).data;
