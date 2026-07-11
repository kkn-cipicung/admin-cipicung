import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit()
	],
	ssr: {
		noExternal: ['@lucide/svelte']
	},
	server: {
		port: 3020,
		strictPort: true
	},
	preview: {
		port: 3020,
		strictPort: true
	}
});
