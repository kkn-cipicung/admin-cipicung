import api from '../../../utils/axios';
import type { RegisterPayload, LoginPayload } from '../_model/payload';
import type { RegisterResponse, LoginResponse } from '../_model/response';

export const registerAdmin = async (payload: RegisterPayload): Promise<RegisterResponse> => {
	const { data } = await api.post<RegisterResponse>('/admin/auth/register', payload);
	return data;
};

export const loginAdmin = async (payload: LoginPayload): Promise<LoginResponse> => {
	const { data } = await api.post<LoginResponse>('/admin/auth/login', payload);
	return data;
};
