<script lang="ts">
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import {
		Sliders,
		FolderOpen,
		Newspaper,
		Sparkles,
		Store,
		X,
		LogOut,
		Compass,
		FileImage,
		MapPinned,
		Images,
		Contact,
		Landmark
	} from '@lucide/svelte';

	let { isOpen = $bindable(false) } = $props();

	const mainMenuItems = [
		{
			name: 'Dashboard',
			href: '/dashboard/manage',
			icon: Sliders
		},
		{
			name: 'Profil',
			href: '/profile',
			icon: Landmark
		},
		{
			name: 'Peta',
			href: '/map',
			icon: MapPinned
		},
		{
			name: 'Potensi Desa',
			href: '/potential',
			icon: Sparkles
		},
		{
			name: 'Galeri',
			href: '/gallery',
			icon: Images
		},
		{
			name: 'Berita',
			href: '/news',
			icon: Newspaper
		},
		{
			name: 'Kontak',
			href: '/contact',
			icon: Contact
		}
	];

	const adminMenuItems = [
		{
			name: 'Kategori',
			href: '/category',
			icon: FolderOpen
		},
		{
			name: 'Bisnis & UMKM',
			href: '/business',
			icon: Store
		},
		{
			name: 'Base64 Formatter',
			href: '/dashboard/base64',
			icon: FileImage
		}
	];

	const isActive = (href: string) => {
		if (href === '/dashboard') {
			return page.url.pathname === '/dashboard';
		}
		return page.url.pathname.startsWith(href);
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
		window.location.href = '/auth/login';
	};
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
		onclick={() => (isOpen = false)}
		aria-hidden="true"
	></div>
{/if}

<aside
	class="fixed bottom-0 top-0 left-0 z-50 flex w-72 flex-col border-r border-hijaugelap-750/30 bg-hijaugelap-600 text-sage-100 transition-all duration-300 ease-in-out lg:sticky lg:translate-x-0
	{isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
>
	<div class="flex h-20 items-center justify-between px-6 border-b border-hijaugelap-700/55">
		<a href="/dashboard" class="flex items-center gap-3 group">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all"
			>
				<Compass size={22} strokeWidth={2.5} />
			</div>
			<div class="flex flex-col">
				<span class="text-md font-bold tracking-tight text-white">Cipicung Admin</span>
				<span class="text-xs font-semibold text-indigo-500 tracking-wider uppercase"
					>Portal Desa</span
				>
			</div>
		</a>

		<button
			type="button"
			class="flex h-9 w-9 items-center justify-center rounded-lg border border-hijaugelap-500 text-sage-200 hover:bg-hijaugelap-500 hover:text-white lg:hidden transition-colors"
			onclick={() => (isOpen = false)}
			aria-label="Close sidebar"
		>
			<X size={18} />
		</button>
	</div>

	<nav class="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
		<div class="px-3 mb-2">
			<p class="text-[10px] font-bold tracking-widest text-sage-400 uppercase">Menu Utama</p>
		</div>

		{#each mainMenuItems as item (item.href)}
			{@const Icon = item.icon}
			<a
				href={item.href}
				onclick={() => (isOpen = false)}
				class="group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-200 relative overflow-hidden
				{isActive(item.href)
					? 'bg-white/10 text-indigo-500 border-l-4 border-indigo-500 font-bold'
					: 'text-sage-200/80 hover:bg-white/5 hover:text-white border-l-4 border-transparent'}"
			>
				<span
					class="transition-transform group-hover:scale-105 duration-200 text-sage-400 group-hover:text-indigo-500 {isActive(
						item.href
					)
						? 'text-indigo-500'
						: ''}"
				>
					<Icon size={20} strokeWidth={2.5} />
				</span>

				<span>{item.name}</span>

				{#if isActive(item.href)}
					<span
						class="absolute right-4 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(141,117,87,0.6)]"
						in:fade={{ duration: 150 }}
					></span>
				{/if}
			</a>
		{/each}

		<div class="px-3 mt-6 mb-2">
			<p class="text-[10px] font-bold tracking-widest text-sage-400 uppercase">
				Pengaturan & Fitur
			</p>
		</div>

		{#each adminMenuItems as item (item.href)}
			{@const Icon = item.icon}
			<a
				href={item.href}
				onclick={() => (isOpen = false)}
				class="group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-200 relative overflow-hidden
				{isActive(item.href)
					? 'bg-white/10 text-indigo-500 border-l-4 border-indigo-500 font-bold'
					: 'text-sage-200/80 hover:bg-white/5 hover:text-white border-l-4 border-transparent'}"
			>
				<span
					class="transition-transform group-hover:scale-105 duration-200 text-sage-400 group-hover:text-indigo-500 {isActive(
						item.href
					)
						? 'text-indigo-500'
						: ''}"
				>
					<Icon size={20} strokeWidth={2.5} />
				</span>

				<span>{item.name}</span>

				{#if isActive(item.href)}
					<span
						class="absolute right-4 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(141,117,87,0.6)]"
						in:fade={{ duration: 150 }}
					></span>
				{/if}
			</a>
		{/each}
	</nav>

	<div class="mt-auto p-4 border-t border-hijaugelap-700/55 bg-hijaugelap-700/25">
		<div
			class="flex items-center justify-between rounded-2xl bg-hijaugelap-700 border border-hijaugelap-500/30 p-3 shadow-sm"
		>
			<div class="flex items-center gap-3 min-w-0">
				<div
					class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/20"
				>
					AC
					<span
						class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-hijaugelap-700"
					></span>
				</div>
				<div class="flex flex-col min-w-0">
					<span class="truncate text-sm font-semibold text-white">Admin Cipicung</span>
					<span class="truncate text-[11px] font-medium text-sage-300">Super Admin</span>
				</div>
			</div>

			<button
				type="button"
				class="flex h-8 w-8 items-center justify-center rounded-lg text-sage-400 hover:bg-hijaugelap-500/50 hover:text-indigo-500 transition-all duration-200"
				title="Log Out"
				onclick={handleLogout}
			>
				<LogOut size={18} />
			</button>
		</div>
	</div>
</aside>
