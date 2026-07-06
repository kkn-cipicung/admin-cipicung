import { API_URL } from './core';
import { getErrorResponse } from './response-handler';
import type { AxiosError } from 'axios';

export type { AxiosError };

import Axios from 'axios';

const axios = Axios.create({
  baseURL: API_URL,
});

type ResponseBody = {
  rc?: unknown;
  message?: unknown;
  msg?: unknown;
};

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
        message: normalizedMessage || undefined,
      };
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
