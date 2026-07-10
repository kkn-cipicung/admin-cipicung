import { API_URL } from '../utils/core';
import { getErrorResponse } from '../utils/response-handler';
import type { AxiosError } from 'axios';

export type { AxiosError };

import Axios from 'axios';

const axios = Axios.create({
	baseURL: API_URL + '/api'
});

type ResponseBody = {
	rc?: unknown;
	message?: unknown;
	msg?: unknown;
};

const AUTH_LOGIN_PATH = '/auth/login';

const getResponseMessage = (data: unknown) => {
	if (!data || typeof data !== 'object') return '';

	const body = data as ResponseBody;
	return (
		(typeof body.msg === 'string' ? body.msg : '') ||
		(typeof body.message === 'string' ? body.message : '')
	);
};

const isBinaryResponseData = (data: unknown) =>
	(typeof Blob !== 'undefined' && data instanceof Blob) ||
	(typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer);

const isUnauthorizedMessage = (message: unknown) =>
	typeof message === 'string' && message.toLowerCase() === 'unauthorized';

const redirectToAuth = () => {
	if (typeof window === 'undefined') return;

	localStorage.removeItem('token');
	document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';

	if (!window.location.pathname.startsWith('/auth/')) {
		window.location.href = AUTH_LOGIN_PATH;
	}
};

axios.interceptors.response.use(
	(response) => {
		if (
			response.data &&
			typeof response.data === 'object' &&
			!Array.isArray(response.data) &&
			!isBinaryResponseData(response.data)
		) {
			const normalizedMessage = getResponseMessage(response.data);
			response.data = {
				status: response.status,
				...response.data,
				message: normalizedMessage || undefined
			};

			if (isUnauthorizedMessage(normalizedMessage)) {
				redirectToAuth();
			}
		}

		return response;
	},
	(error: AxiosError) => {
		const apiResponse = getErrorResponse(error);
		const normalizedError = error as AxiosError & {
			apiResponse?: ReturnType<typeof getErrorResponse>;
		};
		normalizedError.apiResponse = apiResponse;
		normalizedError.message = apiResponse.message ?? normalizedError.message;

		if (error.response?.status === 401 || isUnauthorizedMessage(apiResponse.message)) {
			redirectToAuth();
		}

		return Promise.reject(error);
	}
);

axios.interceptors.request.use((config) => {
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

	if (token) {
		config.headers['Authorization'] = `Bearer ${token}`;
	}

	config.headers['Content-Type'] = 'application/json';

	return config;
});

export default axios;
