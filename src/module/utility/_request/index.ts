import api from '../../../lib/axios';
import type { PingResponse } from '../_model/response';

export const pingServer = async (): Promise<PingResponse> => {
	const { data } = await api.get<PingResponse>('/ping');
	return data;
};
