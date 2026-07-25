import api from '../../../lib/axios';
import type {
	CreateOfficialPayload,
	CreateProfilePayload,
	UpdateOfficialPayload
} from '../_model/payload';
import type {
	EmptyProfileResponse,
	GovernmentStructureResponse,
	OfficialDetailResponse,
	OfficialListResponse,
	ProfileResponse,
	RegionBoundaryResponse,
	ResourcePotentialResponse,
	VisionMissionResponse
} from '../_model/response';

export const createProfile = async (payload: CreateProfilePayload): Promise<EmptyProfileResponse> =>
	(await api.post<EmptyProfileResponse>('/profile/create', payload)).data;
export const saveProfile = createProfile;
export const findProfileById = async (): Promise<ProfileResponse> =>
	(await api.post<ProfileResponse>('/profile/detail', {})).data;
export const getProfile = findProfileById;
export const getActiveProfile = async (): Promise<ProfileResponse> =>
	(await api.post<ProfileResponse>('/profile/detail', {})).data;
export const getRegionBoundary = async (): Promise<RegionBoundaryResponse> =>
	(await api.post<RegionBoundaryResponse>('/profile/region-boundary')).data;
export const getVisionMission = async (): Promise<VisionMissionResponse> =>
	(await api.post<VisionMissionResponse>('/profile/vision-mission')).data;
export const getGovernmentStructure = async (): Promise<GovernmentStructureResponse> =>
	(await api.post<GovernmentStructureResponse>('/profile/government-structure')).data;
export const getResourcePotential = async (): Promise<ResourcePotentialResponse> =>
	(await api.post<ResourcePotentialResponse>('/profile/resource-potential')).data;
export const deleteProfile = async (): Promise<EmptyProfileResponse> =>
	(await api.post<EmptyProfileResponse>('/profile/delete', {})).data;

export const createOfficial = async (
	payload: CreateOfficialPayload
): Promise<EmptyProfileResponse> =>
	(await api.post<EmptyProfileResponse>('/profile/official/create', payload)).data;

export const listOfficials = async (payload?: {
	limit?: number;
	index?: number;
}): Promise<OfficialListResponse> =>
	(await api.post<OfficialListResponse>('/profile/official/list', payload || {})).data;

export const getOfficialDetail = async (payload: { id: number }): Promise<OfficialDetailResponse> =>
	(await api.post<OfficialDetailResponse>('/profile/official/detail', payload)).data;

export const updateOfficial = async (
	payload: UpdateOfficialPayload
): Promise<EmptyProfileResponse> =>
	(await api.post<EmptyProfileResponse>('/profile/official/update', payload)).data;

export const deleteOfficial = async (payload: { id: number }): Promise<EmptyProfileResponse> =>
	(await api.post<EmptyProfileResponse>('/profile/official/delete', payload)).data;
