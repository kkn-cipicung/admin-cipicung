<script lang="ts">
	import { onMount } from 'svelte';
	import { pingServer } from '../../utility/_request';
	import { listNews } from '../../news/_request';
	import { listCategories } from '../../category/_request';
	import { listPotentials } from '../../potential/_request';
	import { listDashboards } from '../_request';
	import { createQuery } from '@tanstack/svelte-query';
	import { Download, ArrowRight, Users, Eye, Activity, Clock } from '@lucide/svelte';

	let serverStatus = $state('Checking...');
	let dbStatus = $state('Checking...');
	let responseTime = $state('...');
	let mediaStatus = $state('12.4 GB / 50 GB');

	const newsQuery = createQuery(() => ({
		queryKey: ['news', 'list'],
		queryFn: () => listNews()
	}));
	const categoriesQuery = createQuery(() => ({
		queryKey: ['categories', 'list'],
		queryFn: () => listCategories()
	}));
	const potentialsQuery = createQuery(() => ({
		queryKey: ['potentials', 'list'],
		queryFn: () => listPotentials()
	}));
	const dashboardsQuery = createQuery(() => ({
		queryKey: ['dashboards', 'list'],
		queryFn: () => listDashboards()
	}));

	let newsCount = $derived<number | string>(
		newsQuery.isPending ? '...' : newsQuery.data?.data?.length || 0
	);
	let potentialCount = $derived<number | string>(
		potentialsQuery.isPending ? '...' : potentialsQuery.data?.data?.length || 0
	);
	let categoryCount = $derived<number | string>(
		categoriesQuery.isPending ? '...' : categoriesQuery.data?.data?.length || 0
	);
	let slideCount = $derived<number | string>(
		dashboardsQuery.isPending ? '...' : dashboardsQuery.data?.data?.length || 0
	);

	let systemHealth = $derived([
		{
			name: 'Database API',
			status: dbStatus,
			badge:
				dbStatus === 'Connected'
					? 'bg-emerald-50 text-emerald-700 border-emerald-200'
					: dbStatus === 'Checking...'
						? 'bg-slate-50 text-slate-700 border-slate-200'
						: 'bg-red-50 text-red-700 border-red-200'
		},
		{
			name: 'Waktu Respon Server',
			status: responseTime,
			badge:
				responseTime !== '...' && responseTime !== 'N/A'
					? 'bg-blue-50 text-blue-700 border-blue-200'
					: 'bg-slate-50 text-slate-700 border-slate-200'
		},
		{
			name: 'Penyimpanan Media',
			status: mediaStatus,
			badge: 'bg-slate-100 text-slate-700 border-slate-200'
		},
		{
			name: 'Koneksi Gateway',
			status: serverStatus,
			badge:
				serverStatus === 'Active'
					? 'bg-emerald-50 text-emerald-700 border-emerald-200'
					: serverStatus === 'Checking...'
						? 'bg-slate-50 text-slate-700 border-slate-200'
						: 'bg-red-50 text-red-700 border-red-200'
		}
	]);

	let totalResources = $derived(
		(typeof newsCount === 'number' ? newsCount : 0) +
			(typeof potentialCount === 'number' ? potentialCount : 0) +
			(typeof categoryCount === 'number' ? categoryCount : 0)
	);

	let moduleShare = $derived([
		{
			name: 'Berita & Informasi (News)',
			percent:
				totalResources > 0
					? Math.round(((typeof newsCount === 'number' ? newsCount : 0) / totalResources) * 100)
					: 0,
			visits: typeof newsCount === 'number' ? newsCount : 0,
			color: 'bg-blue-600'
		},
		{
			name: 'Potensi Desa & UMKM (Potential)',
			percent:
				totalResources > 0
					? Math.round(
							((typeof potentialCount === 'number' ? potentialCount : 0) / totalResources) * 100
						)
					: 0,
			visits: typeof potentialCount === 'number' ? potentialCount : 0,
			color: 'bg-indigo-600'
		},
		{
			name: 'Informasi Kategori (Category)',
			percent:
				totalResources > 0
					? Math.round(
							((typeof categoryCount === 'number' ? categoryCount : 0) / totalResources) * 100
						)
					: 0,
			visits: typeof categoryCount === 'number' ? categoryCount : 0,
			color: 'bg-purple-600'
		}
	]);

	const analyticsStats = $derived([
		{
			name: 'Total Berita',
			count: String(newsCount),
			change: 'Dikelola',
			icon: 'eye',
			desc: 'Konten artikel & informasi publik',
			bgClass: 'bg-blue-50 text-blue-600',
			badgeClass: 'text-blue-600 bg-blue-50/50'
		},
		{
			name: 'Potensi & UMKM',
			count: String(potentialCount),
			change: 'Terdaftar',
			icon: 'users',
			desc: 'Komoditas & ekowisata desa',
			bgClass: 'bg-indigo-50 text-indigo-600',
			badgeClass: 'text-indigo-600 bg-indigo-50/50'
		},
		{
			name: 'Total Kategori',
			count: String(categoryCount),
			change: 'Klasifikasi',
			icon: 'bounce',
			desc: 'Klasifikasi konten modul client',
			bgClass: 'bg-emerald-50 text-emerald-600',
			badgeClass: 'text-emerald-600 bg-emerald-50/50'
		},
		{
			name: 'Total Slide Headline',
			count: String(slideCount),
			change: 'Aktif',
			icon: 'clock',
			desc: 'Slide banner pada halaman utama',
			bgClass: 'bg-purple-50 text-purple-600',
			badgeClass: 'text-purple-600 bg-purple-50/50'
		}
	]);

	onMount(async () => {
		try {
			const start = Date.now();
			const res = await pingServer();
			const end = Date.now();

			responseTime = `${end - start}ms`;
			serverStatus = 'Active';
			dbStatus =
				res.data === 'pong' || res.message === 'pong' || res.data ? 'Connected' : 'Disconnected';
		} catch (err) {
			console.error('Server status check failed:', err);
			serverStatus = 'Offline';
			dbStatus = 'Disconnected';
			responseTime = 'N/A';
		}
	});
</script>

<div class="space-y-8">
	<div
		class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
	>
		<div class="space-y-1">
			<h2 class="text-xl font-extrabold tracking-tight text-slate-900">
				Selamat Datang Kembali, Admin!
			</h2>
			<p class="text-xs font-semibold text-slate-400">
				Semua sistem berjalan dengan normal. Berikut adalah statistik kinerja portal client Desa
				Cipicung.
			</p>
		</div>
		<div class="flex items-center gap-3">
			<button
				class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
			>
				<Download size={14} strokeWidth={2.5} />
				Unduh Laporan
			</button>
			<a
				href="/dashboard/manage"
				class="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 hover:shadow-lg transition-all"
			>
				Atur Konten Client
				<ArrowRight size={14} strokeWidth={2.5} />
			</a>
		</div>
	</div>

	<section class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each analyticsStats as stat (stat.name)}
			<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.name}</span>
					<div class="flex h-9 w-9 items-center justify-center rounded-xl {stat.bgClass}">
						{#if stat.icon === 'users'}
							<Users size={18} strokeWidth={2.5} />
						{:else if stat.icon === 'eye'}
							<Eye size={18} strokeWidth={2.5} />
						{:else if stat.icon === 'bounce'}
							<Activity size={18} strokeWidth={2.5} />
						{:else}
							<Clock size={18} strokeWidth={2.5} />
						{/if}
					</div>
				</div>
				<div class="mt-4 flex items-baseline gap-2">
					<span class="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.count}</span>
					<span class="text-xs font-bold rounded-full px-2 py-0.5 {stat.badgeClass}"
						>{stat.change}</span
					>
				</div>
				<p class="text-[11px] font-medium text-slate-400 mt-1.5">{stat.desc}</p>
			</div>
		{/each}
	</section>

	<section class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 space-y-6">
			<div class="flex items-center justify-between border-b border-slate-150 pb-4">
				<div>
					<h3 class="text-base font-bold text-slate-900">Statistik Pengunjung (7 Hari Terakhir)</h3>
					<p class="text-xs font-medium text-slate-400 mt-0.5">
						Grafik harian total kunjungan halaman pada portal publik.
					</p>
				</div>
				<div
					class="flex items-center gap-1 bg-slate-100 border border-slate-200/50 p-1 rounded-xl text-xs font-bold text-slate-600"
				>
					<span class="bg-white text-slate-950 px-3 py-1 rounded-lg shadow-sm">Kunjungan</span>
					<span class="px-3 py-1">Sesi</span>
				</div>
			</div>

			<div class="w-full h-64 relative">
				<svg class="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
					<line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" stroke-width="1.5" />
					<line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" stroke-width="1.5" />
					<line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" stroke-width="1.5" />
					<line x1="0" y1="190" x2="500" y2="190" stroke="#e2e8f0" stroke-width="2" />

					<defs>
						<linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stop-color="#8d7557" stop-opacity="0.25" />
							<stop offset="100%" stop-color="#8d7557" stop-opacity="0.0" />
						</linearGradient>
					</defs>
					<path
						d="M 5,160 Q 80,130 160,80 T 320,110 T 495,30 L 495,190 L 5,190 Z"
						fill="url(#chartGradient)"
					/>

					<path
						d="M 5,160 Q 80,130 160,80 T 320,110 T 495,30"
						fill="none"
						stroke="#8d7557"
						stroke-width="3"
						stroke-linecap="round"
					/>

					<circle cx="160" cy="80" r="5" fill="#8d7557" stroke="#ffffff" stroke-width="2" />
					<circle cx="320" cy="110" r="5" fill="#8d7557" stroke="#ffffff" stroke-width="2" />
					<circle cx="495" cy="30" r="5" fill="#8d7557" stroke="#ffffff" stroke-width="2" />
				</svg>

				<div
					class="absolute top-[20px] right-[20px] bg-slate-900 text-white rounded-lg p-2 shadow-lg text-[10px] space-y-0.5"
				>
					<div class="font-bold text-slate-400">Rabu, 08 Juli</div>
					<div class="flex items-center gap-1.5 font-extrabold text-blue-400">
						<span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
						682 Pengunjung
					</div>
				</div>
			</div>

			<div
				class="flex justify-between text-[11px] font-bold text-slate-400 px-1 border-t border-slate-100 pt-3"
			>
				<span>Kamis</span>
				<span>Jumat</span>
				<span>Sabtu</span>
				<span>Minggu</span>
				<span>Senin</span>
				<span>Selasa</span>
				<span>Rabu (Hari Ini)</span>
			</div>
		</div>

		<div class="flex flex-col gap-6">
			<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
				<div>
					<h3 class="text-base font-bold text-slate-900">Proporsi Konten Modul</h3>
					<p class="text-xs font-medium text-slate-400 mt-0.5">
						Proporsi sebaran data konten yang terintegrasi.
					</p>
				</div>
				<div class="space-y-4">
					{#each moduleShare as item (item.name)}
						<div class="space-y-1.5">
							<div class="flex items-center justify-between text-xs font-bold text-slate-700">
								<span>{item.name}</span>
								<span class="text-slate-900"
									>{item.percent}%
									<span class="font-semibold text-slate-400">({item.visits})</span></span
								>
							</div>
							<div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
								<div
									class="h-full rounded-full {item.color} transition-all duration-500"
									style="width: {item.percent}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 flex-1">
				<div>
					<h3 class="text-base font-bold text-slate-900">Status Sistem & API</h3>
					<p class="text-xs font-medium text-slate-400 mt-0.5">
						Integrasi server backend dan database.
					</p>
				</div>

				<div class="grid grid-cols-2 gap-3.5">
					{#each systemHealth as item (item.name)}
						<div
							class="border border-slate-100 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-between"
						>
							<span
								class="text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-none"
								>{item.name}</span
							>
							<span
								class="inline-block mt-2 rounded border px-2 py-0.5 text-xs font-bold text-center w-full {item.badge}"
							>
								{item.status}
							</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>
</div>
