import api from '../../../lib/axios';
import type { CreateProfilePayload, ProfileIdPayload } from '../_model/payload';
import type {
	EmptyProfileResponse,
	GovernmentStructureResponse,
	ProfileResponse,
	RegionBoundaryResponse,
	ResourcePotentialResponse,
	VisionMissionResponse
} from '../_model/response';

export const createProfile = async (payload: CreateProfilePayload): Promise<EmptyProfileResponse> =>
	(await api.post<EmptyProfileResponse>('/profile/create', payload)).data;
export const saveProfile = createProfile;
export const findProfileById = async (payload?: ProfileIdPayload): Promise<ProfileResponse> =>
	(await api.post<ProfileResponse>('/profile/detail', payload || {})).data;
export const getRegionBoundary = async (): Promise<RegionBoundaryResponse> =>
	(await api.post<RegionBoundaryResponse>('/profile/region-boundary', {})).data;
export const getVisionMission = async (): Promise<VisionMissionResponse> =>
	(await api.post<VisionMissionResponse>('/profile/vision-mission', {})).data;
export const getGovernmentStructure = async (): Promise<GovernmentStructureResponse> =>
	(await api.post<GovernmentStructureResponse>('/profile/government-structure', {})).data;
export const getResourcePotential = async (): Promise<ResourcePotentialResponse> =>
	(await api.post<ResourcePotentialResponse>('/profile/resource-potential', {})).data;
export const deleteProfile = async (payload?: ProfileIdPayload): Promise<EmptyProfileResponse> =>
	(await api.post<EmptyProfileResponse>('/profile/delete', payload || {})).data;
