export interface Base64ImageDetails {
	isValid: boolean;
	mimeType: string | null;
	extension: string | null;
	cleanBase64: string;
	dataUrl: string | null;
	sizeBytes: number | null;
	error?: string;
}

export function fileToBase64(file: File | Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});
}

export function parseBase64Image(input: string): Base64ImageDetails {
	const trimmed = input.trim();
	if (!trimmed) {
		return {
			isValid: false,
			mimeType: null,
			extension: null,
			cleanBase64: '',
			dataUrl: null,
			sizeBytes: null,
			error: 'Input string is empty'
		};
	}

	const dataUrlRegex = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/is;
	const match = trimmed.match(dataUrlRegex);

	let mimeType: string | null;
	let cleanBase64: string;

	if (match) {
		mimeType = match[1];
		cleanBase64 = match[2].trim();
	} else {
		const cleanPrefix = trimmed.substring(0, 30);
		if (cleanPrefix.startsWith('iVBORw0KGgo')) {
			mimeType = 'image/png';
		} else if (cleanPrefix.startsWith('/9j/')) {
			mimeType = 'image/jpeg';
		} else if (cleanPrefix.startsWith('R0lGOD')) {
			mimeType = 'image/gif';
		} else if (cleanPrefix.startsWith('UklGR')) {
			mimeType = 'image/webp';
		} else if (cleanPrefix.startsWith('PHN2Zy') || cleanPrefix.startsWith('PD94bWw')) {
			mimeType = 'image/svg+xml';
		} else {
			mimeType = 'image/png';
		}

		const sanitized = trimmed.replace(/\s/g, '');
		cleanBase64 = sanitized;
	}

	const sanitizedBase64 = cleanBase64.replace(/\s/g, '');
	const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

	if (!base64Regex.test(sanitizedBase64)) {
		return {
			isValid: false,
			mimeType: null,
			extension: null,
			cleanBase64: trimmed,
			dataUrl: null,
			sizeBytes: null,
			error: 'String contains characters that are not valid in Base64 encoding.'
		};
	}

	if (sanitizedBase64.length % 4 !== 0) {
		return {
			isValid: false,
			mimeType: null,
			extension: null,
			cleanBase64: sanitizedBase64,
			dataUrl: null,
			sizeBytes: null,
			error: 'Base64 string length is not a multiple of 4 (invalid padding).'
		};
	}

	const dataUrl = `data:${mimeType};base64,${sanitizedBase64}`;

	let padding = 0;
	if (sanitizedBase64.endsWith('==')) {
		padding = 2;
	} else if (sanitizedBase64.endsWith('=')) {
		padding = 1;
	}
	const sizeBytes = Math.floor((sanitizedBase64.length * 3) / 4) - padding;

	const extension = mimeType ? mimeType.split('/')[1]?.replace('+xml', '') || null : null;

	return {
		isValid: true,
		mimeType,
		extension,
		cleanBase64: sanitizedBase64,
		dataUrl,
		sizeBytes
	};
}

export interface CropRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
		img.onerror = () => reject(new Error('Failed to load image'));
		img.src = dataUrl;
	});
}

export function cropBase64Image(
	dataUrl: string,
	crop: CropRect,
	outputMime: string = 'image/png'
): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = crop.width;
			canvas.height = crop.height;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error('Could not get canvas context'));
				return;
			}
			ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
			resolve(canvas.toDataURL(outputMime, 0.92));
		};
		img.onerror = () => reject(new Error('Failed to load image for cropping'));
		img.src = dataUrl;
	});
}

export function resizeBase64Image(
	dataUrl: string,
	maxWidth: number,
	maxHeight: number,
	outputMime: string = 'image/png'
): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			let { naturalWidth: w, naturalHeight: h } = img;

			if (w <= maxWidth && h <= maxHeight) {
				resolve(dataUrl);
				return;
			}

			const ratio = Math.min(maxWidth / w, maxHeight / h);
			w = Math.round(w * ratio);
			h = Math.round(h * ratio);

			const canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error('Could not get canvas context'));
				return;
			}
			ctx.drawImage(img, 0, 0, w, h);
			resolve(canvas.toDataURL(outputMime, 0.92));
		};
		img.onerror = () => reject(new Error('Failed to load image for resizing'));
		img.src = dataUrl;
	});
}
