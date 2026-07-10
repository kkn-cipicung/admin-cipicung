import { QueryClient } from '@tanstack/svelte-query';

export const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: 30_000,
				refetchOnWindowFocus: false
			}
		}
	});
