import type { AxiosError } from 'axios';

export function getErrorResponse(error: AxiosError) {
	if (error.response && error.response.data) {
		const data = error.response.data as any;
		return {
			message: data.message || data.msg || error.message,
			error: data.error || null
		};
	}
	return {
		message: error.message,
		error: null
	};
}
