import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');
	const { pathname } = event.url;

	if (pathname.startsWith('/_app') || pathname.includes('.')) {
		return resolve(event);
	}

	if (pathname.startsWith('/auth/')) {
		if (token) {
			throw redirect(302, '/dashboard');
		}
		return resolve(event);
	}

	if (pathname === '/') {
		if (token) {
			throw redirect(302, '/dashboard');
		} else {
			throw redirect(302, '/auth/login');
		}
	}

	if (!token) {
		throw redirect(302, '/auth/login');
	}

	event.locals.token = token;

	return resolve(event);
};
