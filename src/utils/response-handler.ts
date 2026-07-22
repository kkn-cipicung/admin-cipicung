import type { AxiosError } from 'axios';

export function getErrorResponse(error: AxiosError) {
	if (error.response && error.response.data) {
		const data = error.response.data as { message?: string; msg?: string; error?: string | null };
		const mainMsg = data.message || data.msg || error.message;
		const detail = data.error || null;
		const fullMsg = detail && detail !== mainMsg ? `${mainMsg}: ${detail}` : mainMsg;
		return {
			message: fullMsg,
			error: detail
		};
	}
	return {
		message: error.message,
		error: null
	};
}
