<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { createQueryClient } from '$lib/query-client';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { Menu } from '@lucide/svelte';

	let { children } = $props();

	const queryClient = createQueryClient();

	let sidebarOpen = $state(false);

	const pageTitles: Record<string, string> = {
		'/dashboard/manage': 'Pengaturan Dashboard Client',
		'/dashboard/base64': 'Format Base64 & Gambar',
		'/dashboard': 'Ringkasan Dashboard',
		'/category': 'Manajemen Kategori',
		'/news': 'Kelola Berita & Informasi',
		'/potential': 'Potensi & UMKM Desa',
		'/business': 'Bisnis & UMKM Desa',
		'/gallery': 'Galeri Desa',
		'/map': 'Peta Desa',
		'/profile': 'Profil Desa',
		'/contact': 'Kontak Desa'
	};

	function getPageTitle(pathname: string) {
		const matchedKey = Object.keys(pageTitles).find((key) => pathname.startsWith(key));
		return matchedKey ? pageTitles[matchedKey] : 'Halaman Utama';
	}

	function getGreeting() {
		const hour = new Date().getHours();
		if (hour < 10) return 'Selamat Pagi';
		if (hour < 15) return 'Selamat Siang';
		if (hour < 18) return 'Selamat Sore';
		return 'Selamat Malam';
	}

	const greeting = getGreeting();

	$effect(() => {
		const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
		const pathname = page.url.pathname;

		if (!pathname.startsWith('/auth/')) {
			if (!token) {
				goto('/auth/login');
			}
		} else {
			if (token) {
				goto('/dashboard');
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{getPageTitle(page.url.pathname)} | Admin Cipicung</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
	{#if page.url.pathname.startsWith('/auth/')}
		{@render children()}
	{:else}
		<div class="flex min-h-screen bg-slate-50 font-sans text-slate-800">
			<Sidebar bind:isOpen={sidebarOpen} />

			<div class="flex flex-1 flex-col min-h-screen overflow-x-hidden">
				<header
					class="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-md lg:px-8"
				>
					<div class="flex items-center gap-4">
						<button
							type="button"
							class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 lg:hidden transition-colors"
							onclick={() => (sidebarOpen = true)}
							aria-label="Open sidebar"
						>
							<Menu size={22} />
						</button>

						<div class="flex flex-col">
							<h1 class="text-lg font-bold text-slate-900 md:text-xl tracking-tight">
								{getPageTitle(page.url.pathname)}
							</h1>
							<p class="hidden sm:block text-[11px] font-medium text-slate-500 mt-0.5">
								Admin Panel / {page.url.pathname.substring(1) || 'home'}
							</p>
						</div>
					</div>

					<div class="flex items-center gap-4">
						<span
							class="hidden md:flex items-center gap-2 text-xs font-semibold text-abuhijau-700 bg-sage-50/50 border border-sage-200/60 rounded-full px-4 py-1.5 shadow-sm"
						>
							{greeting}, Admin 👋
						</span>

					</div>
				</header>

				<main class="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
					{@render children()}
				</main>
			</div>
		</div>
	{/if}
</QueryClientProvider>

<Toast />