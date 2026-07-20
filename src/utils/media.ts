import { API_URL } from './core';

export function getMediaUrl(media: number | string | null | undefined) {
	return getMediaUrlCandidates(media)[0] || '';
}

export function getMediaUrlCandidates(media: number | string | null | undefined) {
	if (media === null || media === undefined || media === '') return [];

	const value = String(media).trim().replace(/^#/, '');
	if (!value) return [];
	if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
		return [value];
	}

	const baseUrl = (API_URL || '').replace(/\/$/, '');
	const normalizedPath = value.replace(/^\//, '');

	if (/^\d+$/.test(value)) {
		return [
			`${baseUrl}/api/media/${value}`,
			`${baseUrl}/api/media?id=${value}`,
			`${baseUrl}/media/${value}`,
			`${baseUrl}/media?id=${value}`,
			`${baseUrl}/uploads/${value}`
		];
	}

	return [`${baseUrl}/${normalizedPath}`];
}
