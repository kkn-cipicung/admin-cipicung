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

	const rawBaseUrl = (API_URL || '').replace(/\/$/, '');
	const baseUrlWithoutApi = rawBaseUrl.replace(/\/api$/, '');
	const normalizedPath = value.replace(/^\//, '');

	if (/^\d+$/.test(value)) {
		return [
			`${baseUrlWithoutApi}/uploads/${value}`,
			`${rawBaseUrl}/media/${value}`,
			`${baseUrlWithoutApi}/media/${value}`,
			`${rawBaseUrl}/api/media/${value}`
		];
	}

	const candidates = [
		`${baseUrlWithoutApi}/${normalizedPath}`,
		`${rawBaseUrl}/${normalizedPath}`,
		`/${normalizedPath}`
	];

	return Array.from(new Set(candidates)).filter(Boolean);
}
