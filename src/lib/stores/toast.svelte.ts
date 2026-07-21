export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
	id: string;
	type: ToastType;
	title: string;
	message?: string;
	duration: number;
};

type ToastInput = {
	title: string;
	message?: string;
	duration?: number;
};

const DEFAULT_DURATION = 4000;

let toasts = $state<Toast[]>([]);

function generateId() {
	return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function addToast(type: ToastType, input: ToastInput | string) {
	const normalized: ToastInput = typeof input === 'string' ? { title: input } : input;

	const toast: Toast = {
		id: generateId(),
		type,
		title: normalized.title,
		message: normalized.message,
		duration: normalized.duration ?? DEFAULT_DURATION
	};

	toasts = [...toasts, toast];

	setTimeout(() => {
		removeToast(toast.id);
	}, toast.duration);

	return toast.id;
}

function removeToast(id: string) {
	toasts = toasts.filter((t) => t.id !== id);
}

export const toast = {
	success: (input: ToastInput | string) => addToast('success', input),
	error: (input: ToastInput | string) => addToast('error', input),
	info: (input: ToastInput | string) => addToast('info', input),
	warning: (input: ToastInput | string) => addToast('warning', input),
	remove: removeToast
};

export function getToasts() {
	return toasts;
}
