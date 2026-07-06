import type { AxiosError } from 'axios';

export function getErrorResponse(error: AxiosError) {
	if (error.response && error.response.data) {
		const data = error.response.data as { message?: string; msg?: string; error?: string | null };
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
