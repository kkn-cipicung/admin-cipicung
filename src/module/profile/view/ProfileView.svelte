<script lang="ts">
	import {
		createOfficial,
		deleteOfficial,
		getGovernmentStructure,
		getProfile,
		getRegionBoundary,
		getResourcePotential,
		getVisionMission,
		listOfficials,
		saveProfile,
		updateOfficial
	} from '../_request';
	import type { OfficialData } from '../_model/response';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import Button from '$lib/components/ui/Button.svelte';
	import FloatingInput from '$lib/components/ui/FloatingInput.svelte';
	import FloatingTextarea from '$lib/components/ui/FloatingTextarea.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import {
		CheckCircle2,
		Landmark,
		Loader2,
		MapPin,
		Pencil,
		Plus,
		Sparkles,
		Target,
		Trash2,
		Users
	} from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';

	type HeadmanForm = {
		name: string;
		position: string;
		start_date: string;
		finish_date: string;
		is_active: boolean;
	};

	function formatPosition(pos?: string): string {
		if (!pos) return '-';
		return pos
			.split(/[-_]/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	const queryClient = useQueryClient();
	const profileQuery = createQuery(() => ({
		queryKey: ['profile', 'detail'],
		queryFn: () => getProfile(),
		retry: false
	}));
	const regionQuery = createQuery(() => ({
		queryKey: ['profile', 'region'],
		queryFn: getRegionBoundary,
		retry: false
	}));
	const visionQuery = createQuery(() => ({
		queryKey: ['profile', 'vision'],
		queryFn: getVisionMission,
		retry: false
	}));
	const governmentQuery = createQuery(() => ({
		queryKey: ['profile', 'government'],
		queryFn: getGovernmentStructure,
		retry: false
	}));
	const resourceQuery = createQuery(() => ({
		queryKey: ['profile', 'resource'],
		queryFn: getResourcePotential,
		retry: false
	}));
	const officialsQuery = createQuery(() => ({
		queryKey: ['profile', 'officials'],
		queryFn: () => listOfficials()
	}));

	let officials = $derived(officialsQuery.data?.data || []);

	let isOfficialDialogOpen = $state(false);
	let editingOfficial = $state<OfficialData | null>(null);
	let isSavingOfficial = $state(false);
	let isDeleteOfficialDialogOpen = $state(false);
	let isDeletingOfficial = $state(false);
	let deleteOfficialTargetId = $state<number | null>(null);

	let officialForm = $state({
		name: '',
		position: '',
		order_number: 1,
		is_active: true
	});

	function handleCreateOfficial() {
		editingOfficial = null;
		officialForm = {
			name: '',
			position: '',
			order_number: officials.length + 1,
			is_active: true
		};
		isOfficialDialogOpen = true;
	}

	function handleEditOfficial(item: OfficialData) {
		editingOfficial = item;
		officialForm = {
			name: item.name,
			position: item.position,
			order_number: item.order_number || 1,
			is_active: Boolean(item.is_active)
		};
		isOfficialDialogOpen = true;
	}

	async function handleSaveOfficial(e: Event) {
		e.preventDefault();
		if (isSavingOfficial) return;
		isSavingOfficial = true;
		try {
			const payload = {
				name: officialForm.name,
				position: officialForm.position,
				order_number: Number(officialForm.order_number) || 1,
				is_active: officialForm.is_active
			};
			if (editingOfficial) {
				await updateOfficial({ id: editingOfficial.id, ...payload });
			} else {
				await createOfficial(payload);
			}
			isOfficialDialogOpen = false;
			await queryClient.invalidateQueries({ queryKey: ['profile', 'officials'] });
			await queryClient.invalidateQueries({ queryKey: ['profile', 'government'] });
			toast.success('Perangkat desa berhasil disimpan!');
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menyimpan perangkat desa', message: msg });
		} finally {
			isSavingOfficial = false;
		}
	}

	function handleDeleteOfficialClick(id: number) {
		deleteOfficialTargetId = id;
		isDeleteOfficialDialogOpen = true;
	}

	async function confirmDeleteOfficial() {
		if (deleteOfficialTargetId === null) return;
		isDeletingOfficial = true;
		try {
			await deleteOfficial({ id: deleteOfficialTargetId });
			await queryClient.invalidateQueries({ queryKey: ['profile', 'officials'] });
			await queryClient.invalidateQueries({ queryKey: ['profile', 'government'] });
			toast.success('Perangkat desa berhasil dihapus.');
			isDeleteOfficialDialogOpen = false;
			deleteOfficialTargetId = null;
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menghapus perangkat desa', message: msg });
		} finally {
			isDeletingOfficial = false;
		}
	}

	let form = $state({
		name: '',
		province: '',
		regency: '',
		district: '',
		address: '',
		postal_code: '',
		phone: '',
		email: '',
		vision: '',
		mission: '',
		history: '',
		description: '',
		region: '',
		hamlet_one: '',
		hamlet_two: '',
		rt_hamlet_one: '',
		rt_hamlet_two: '',
		rw_hamlet_one: '',
		rw_hamlet_two: '',
		north_border: '',
		east_border: '',
		south_border: '',
		west_border: '',
		area: '',
		latitude: '',
		longitude: '',
		headmen: [
			{
				name: '',
				position: 'kepala-desa',
				start_date: '',
				finish_date: '',
				is_active: true
			}
		] as HeadmanForm[]
	});
	let profileId = $state<number | null>(null);
	let hasHydrated = $state(false);
	let isSaving = $state(false);

	$effect(() => {
		const data = profileQuery.data?.data;
		if (data && !hasHydrated) {
			if (data.id) profileId = data.id;
			form = {
				name: data.name || '',
				province: data.province || '',
				regency: data.regency || '',
				district: data.district || '',
				address: data.address || '',
				postal_code: data.postal_code || '',
				phone: data.phone || '',
				email: data.email || '',
				vision: data.vision || '',
				mission: Array.isArray(data.mission) ? data.mission.join('\n') : data.mission || '',
				history: data.history || '',
				description: data.description || '',
				region: data.region || '',
				hamlet_one:
					data.hamlet_one !== undefined && data.hamlet_one !== null ? String(data.hamlet_one) : '',
				hamlet_two:
					data.hamlet_two !== undefined && data.hamlet_two !== null ? String(data.hamlet_two) : '',
				rt_hamlet_one:
					data.rt_hamlet_one !== undefined && data.rt_hamlet_one !== null
						? String(data.rt_hamlet_one)
						: '',
				rt_hamlet_two:
					data.rt_hamlet_two !== undefined && data.rt_hamlet_two !== null
						? String(data.rt_hamlet_two)
						: '',
				rw_hamlet_one:
					data.rw_hamlet_one !== undefined && data.rw_hamlet_one !== null
						? String(data.rw_hamlet_one)
						: '',
				rw_hamlet_two:
					data.rw_hamlet_two !== undefined && data.rw_hamlet_two !== null
						? String(data.rw_hamlet_two)
						: '',
				north_border: data.north_border || '',
				east_border: data.east_border || '',
				south_border: data.south_border || '',
				west_border: data.west_border || '',
				area: data.area || '',
				latitude:
					data.latitude !== undefined && data.latitude !== null ? String(data.latitude) : '',
				longitude:
					data.longitude !== undefined && data.longitude !== null ? String(data.longitude) : '',
				headmen:
					Array.isArray(data.headmen) && data.headmen.length > 0
						? data.headmen.map((h) => ({
								name: h.name || '',
								position: h.position || 'kepala-desa',
								start_date: h.start_date || '',
								finish_date: h.finish_date || '',
								is_active: Boolean(h.is_active)
							}))
						: [
								{
									name: '',
									position: 'kepala-desa',
									start_date: '',
									finish_date: '',
									is_active: true
								}
							]
			};
			hasHydrated = true;
		}
	});

	function addHeadman() {
		form.headmen = [
			...form.headmen,
			{
				name: '',
				position: 'kepala-desa',
				start_date: '',
				finish_date: '',
				is_active: false
			}
		];
	}

	function removeHeadman(index: number) {
		form.headmen = form.headmen.filter((_, itemIndex) => itemIndex !== index);
	}

	async function save(event: Event) {
		event.preventDefault();
		isSaving = true;
		const payload = {
			...(profileId ? { id: profileId } : {}),
			name: form.name,
			province: form.province,
			regency: form.regency,
			district: form.district,
			address: form.address,
			postal_code: form.postal_code || undefined,
			phone: form.phone || undefined,
			email: form.email || undefined,
			vision: form.vision || undefined,
			mission: form.mission
				.split('\n')
				.map((item) => item.trim())
				.filter(Boolean),
			history: form.history || undefined,
			description: form.description || undefined,
			region: form.region || undefined,
			hamlet_one:
				form.hamlet_one !== '' && form.hamlet_one !== null && form.hamlet_one !== undefined
					? Math.floor(Number(form.hamlet_one))
					: undefined,
			hamlet_two:
				form.hamlet_two !== '' && form.hamlet_two !== null && form.hamlet_two !== undefined
					? Math.floor(Number(form.hamlet_two))
					: undefined,
			rt_hamlet_one:
				form.rt_hamlet_one !== '' && form.rt_hamlet_one !== null && form.rt_hamlet_one !== undefined
					? Math.floor(Number(form.rt_hamlet_one))
					: undefined,
			rt_hamlet_two:
				form.rt_hamlet_two !== '' && form.rt_hamlet_two !== null && form.rt_hamlet_two !== undefined
					? Math.floor(Number(form.rt_hamlet_two))
					: undefined,
			rw_hamlet_one:
				form.rw_hamlet_one !== '' && form.rw_hamlet_one !== null && form.rw_hamlet_one !== undefined
					? Math.floor(Number(form.rw_hamlet_one))
					: undefined,
			rw_hamlet_two:
				form.rw_hamlet_two !== '' && form.rw_hamlet_two !== null && form.rw_hamlet_two !== undefined
					? Math.floor(Number(form.rw_hamlet_two))
					: undefined,
			north_border: form.north_border || undefined,
			east_border: form.east_border || undefined,
			south_border: form.south_border || undefined,
			west_border: form.west_border || undefined,
			area: form.area || undefined,
			latitude: form.latitude ? Number(form.latitude) : undefined,
			longitude: form.longitude ? Number(form.longitude) : undefined,
			headmen: form.headmen
				.filter((headman) => headman.name.trim())
				.map((headman) => ({
					name: headman.name,
					position: headman.position || 'kepala-desa',
					start_date: headman.start_date || undefined,
					finish_date: headman.finish_date || null,
					is_active: headman.is_active
				}))
		};
		try {
			await saveProfile(payload);
			await queryClient.invalidateQueries({ queryKey: ['profile'] });
			toast.success({ title: 'Berhasil!', message: 'Profil desa berhasil disimpan.' });
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menyimpan', message: msg });
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
	<div class="space-y-6">
		<form
			onsubmit={save}
			class="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
		>
			<div>
				<h2 class="text-base font-bold text-slate-900">Pengelolaan Profil Desa</h2>
				<p class="mt-1 text-xs font-medium text-slate-500">
					Kelola identitas, visi misi, wilayah, dan kepala desa.
				</p>
			</div>
			<div class="grid gap-4 md:grid-cols-3">
				<FloatingInput bind:value={form.name} label="Nama desa" required />
				<FloatingInput bind:value={form.province} label="Provinsi" required />
				<FloatingInput bind:value={form.regency} label="Kabupaten" required />
				<FloatingInput bind:value={form.district} label="Kecamatan" required />
				<FloatingInput bind:value={form.postal_code} label="Kode pos" />
				<FloatingInput bind:value={form.phone} label="Telepon" />
				<FloatingInput bind:value={form.email} label="Email" />
				<FloatingInput bind:value={form.region} label="Wilayah" />
				<FloatingInput type="number" bind:value={form.rt_hamlet_one} label="RT Dusun 1" />
				<FloatingInput type="number" bind:value={form.rt_hamlet_two} label="RT Dusun 2" />
				<FloatingInput type="number" bind:value={form.rw_hamlet_one} label="RW Dusun 1" />
				<FloatingInput type="number" bind:value={form.rw_hamlet_two} label="RW Dusun 2" />
				<FloatingInput bind:value={form.north_border} label="Batas utara" />
				<FloatingInput bind:value={form.east_border} label="Batas timur" />
				<FloatingInput bind:value={form.south_border} label="Batas selatan" />
				<FloatingInput bind:value={form.west_border} label="Batas barat" />
				<FloatingInput bind:value={form.area} label="Luas wilayah" />
				<FloatingInput
					type="number"
					step="any"
					bind:value={form.latitude}
					label="Latitude (-6.6075°)"
				/>
				<FloatingInput
					type="number"
					step="any"
					bind:value={form.longitude}
					label="Longitude (107.37667°)"
				/>
			</div>
			<FloatingInput bind:value={form.address} label="Alamat" required />
			<FloatingTextarea bind:value={form.description} label="Deskripsi desa" rows={3} />
			<FloatingTextarea bind:value={form.history} label="Sejarah" rows={3} />
			<FloatingTextarea bind:value={form.vision} label="Visi" rows={3} />
			<FloatingTextarea bind:value={form.mission} label="Misi, satu baris per poin" rows={5} />

			<section class="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
				<div class="flex items-center justify-between gap-3">
					<div>
						<h3 class="text-sm font-bold text-slate-900">Kepala Desa</h3>
						<p class="mt-0.5 text-xs font-medium text-slate-500">
							Kelola riwayat kepala desa lama dan kepala desa aktif.
						</p>
					</div>
					<Button type="button" size="sm" onclick={addHeadman}>
						<Plus size={14} />
						Tambah
					</Button>
				</div>

				<div class="space-y-3">
					{#each form.headmen as headman, index (index)}
						<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
							<div class="mb-4 flex items-center justify-between gap-3">
								<span class="text-xs font-bold uppercase tracking-wide text-slate-500">
									Kepala Desa {index + 1}
								</span>
								<Button
									type="button"
									variant="outline"
									size="icon"
									class="hover:border-red-200 hover:bg-red-50 hover:text-red-650"
									onclick={() => removeHeadman(index)}
									disabled={form.headmen.length === 1}
									title="Hapus kepala desa"
								>
									<Trash2 size={14} />
								</Button>
							</div>

							<div class="grid gap-4 md:grid-cols-2">
								<FloatingInput bind:value={headman.name} label="Nama kepala desa" />
								<FloatingInput bind:value={headman.position} label="Jabatan" />
								<FloatingInput type="date" bind:value={headman.start_date} label="Tanggal mulai" />
								<FloatingInput
									type="date"
									bind:value={headman.finish_date}
									label="Tanggal selesai"
								/>
							</div>

							<label class="mt-4 flex items-center gap-2 text-xs font-bold text-slate-600">
								<input
									type="checkbox"
									bind:checked={headman.is_active}
									class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
								/>
								Sedang aktif menjabat
							</label>
						</div>
					{/each}
				</div>
			</section>

			<div class="flex justify-end">
				<Button type="submit" disabled={isSaving}
					>{isSaving ? 'Menyimpan...' : 'Simpan Profil'}</Button
				>
			</div>
		</form>

		<!-- Perangkat Desa / Officials Section -->
		<section class="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between gap-4">
				<div>
					<h3 class="text-base font-bold text-slate-900">Perangkat Desa (Officials)</h3>
					<p class="mt-0.5 text-xs font-medium text-slate-500">
						Kelola daftar struktur perangkat desa, aparatur, dan posisinya.
					</p>
				</div>
				<Button size="sm" onclick={handleCreateOfficial}>
					<Plus size={14} />
					Tambah Perangkat Desa
				</Button>
			</div>

			{#if officialsQuery.isPending}
				<div
					class="flex items-center justify-center p-8 text-xs font-semibold text-slate-400 gap-2"
				>
					<Loader2 size={16} class="animate-spin" /> Memuat daftar perangkat desa...
				</div>
			{:else if officials.length === 0}
				<div
					class="rounded-lg border border-dashed border-slate-200 p-8 text-center text-xs font-medium text-slate-400"
				>
					Belum ada data perangkat desa. Klik tombol di atas untuk menambah.
				</div>
			{:else}
				<div class="divide-y divide-slate-100 rounded-lg border border-slate-200">
					{#each officials as item (item.id)}
						<div class="flex items-center justify-between p-4 hover:bg-slate-50/50">
							<div>
								<div class="flex items-center gap-2">
									<h4 class="text-sm font-bold text-slate-900">{item.name}</h4>
									<span
										class="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase"
									>
										{formatPosition(item.position)}
									</span>
									{#if item.is_active}
										<span
											class="rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 uppercase"
										>
											Aktif
										</span>
									{/if}
								</div>
							</div>

							<div class="flex items-center gap-2">
								<Button
									variant="outline"
									size="icon"
									onclick={() => handleEditOfficial(item)}
									title="Edit Perangkat Desa"
								>
									<Pencil size={14} />
								</Button>
								<Button
									variant="outline"
									size="icon"
									class="hover:border-red-200 hover:bg-red-50 hover:text-red-650"
									onclick={() => handleDeleteOfficialClick(item.id)}
									title="Hapus Perangkat Desa"
								>
									<Trash2 size={14} />
								</Button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>
	</div>

	<aside class="space-y-5">
		<!-- Visi & Misi Card -->
		<section
			class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
		>
			<div class="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 p-4">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100/80 text-blue-600 shadow-xs"
				>
					<Target size={18} />
				</div>
				<div>
					<h3 class="text-sm font-bold text-slate-900">Visi & Misi Aktif</h3>
					<p class="text-[11px] font-medium text-slate-500">Prinsip & panduan desa</p>
				</div>
			</div>
			<div class="p-4 space-y-3">
				{#if visionQuery.isPending}
					<div class="flex items-center gap-2 py-2 text-xs font-semibold text-slate-400">
						<Loader2 size={16} class="animate-spin text-blue-500" /> Memuat visi...
					</div>
				{:else if visionQuery.data?.data?.vision}
					<div class="relative rounded-lg border-l-4 border-blue-500 bg-blue-50/40 p-3">
						<p class="text-xs font-medium italic leading-relaxed text-slate-700">
							"{visionQuery.data.data.vision}"
						</p>
					</div>
					{#if visionQuery.data?.data?.mission && visionQuery.data.data.mission.length > 0}
						<div class="pt-1">
							<div class="mb-2 flex items-center justify-between">
								<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
									>Misi Utama</span
								>
								<span
									class="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700"
								>
									{visionQuery.data.data.mission.length} Poin
								</span>
							</div>
							<ul class="space-y-1.5">
								{#each visionQuery.data.data.mission as item, index (index)}
									<li class="flex items-start gap-2 text-xs text-slate-600">
										<CheckCircle2 size={14} class="mt-0.5 shrink-0 text-blue-500" />
										<span class="leading-tight">{item}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{:else}
					<p class="text-xs font-medium italic text-slate-400">Belum ada visi yang diatur.</p>
				{/if}
			</div>
		</section>

		<!-- Wilayah Card -->
		<section
			class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
		>
			<div class="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 p-4">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-600 shadow-xs"
				>
					<MapPin size={18} />
				</div>
				<div>
					<h3 class="text-sm font-bold text-slate-900">Informasi Wilayah</h3>
					<p class="text-[11px] font-medium text-slate-500">Cakupan & batas desa</p>
				</div>
			</div>
			<div class="p-4 space-y-3">
				{#if regionQuery.isPending}
					<div class="flex items-center gap-2 py-2 text-xs font-semibold text-slate-400">
						<Loader2 size={16} class="animate-spin text-emerald-500" /> Memuat wilayah...
					</div>
				{:else}
					<div class="grid grid-cols-2 gap-2">
						<div class="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
							<span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400"
								>Wilayah</span
							>
							<span class="mt-0.5 block truncate text-xs font-bold text-slate-800">
								{regionQuery.data?.data?.region || '-'}
							</span>
						</div>
						<div class="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
							<span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400"
								>Luas Wilayah</span
							>
							<span class="mt-0.5 block truncate text-xs font-bold text-emerald-700">
								{regionQuery.data?.data?.area || '-'}
							</span>
						</div>
					</div>

					{#if regionQuery.data?.data?.total_family !== undefined}
						<div
							class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs"
						>
							<div class="flex items-center gap-2 font-medium text-slate-700">
								<Users size={14} class="text-slate-500" />
								<span>Jumlah KK</span>
							</div>
							<div class="font-bold text-slate-900">
								{regionQuery.data?.data?.total_family || 0} KK
							</div>
						</div>
					{/if}

					<div class="grid grid-cols-2 gap-2">
						<div class="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
							<span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400"
								>RT / RW Dusun 1</span
							>
							<span class="mt-0.5 block text-xs font-bold text-slate-900">
								{regionQuery.data?.data?.rt_hamlet_one || 0} /
								{regionQuery.data?.data?.rw_hamlet_one || 0}
							</span>
						</div>
						<div class="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
							<span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400"
								>RT / RW Dusun 2</span
							>
							<span class="mt-0.5 block text-xs font-bold text-slate-900">
								{regionQuery.data?.data?.rt_hamlet_two || 0} /
								{regionQuery.data?.data?.rw_hamlet_two || 0}
							</span>
						</div>
					</div>

					<div
						class="flex items-center justify-between rounded-lg border border-emerald-100/80 bg-emerald-50/40 p-2.5 text-xs"
					>
						<div class="flex items-center gap-2 font-medium text-emerald-800">
							<Users size={14} class="text-emerald-600" />
							<span>Total RT / RW</span>
						</div>
						<div class="font-bold text-emerald-900">
							{regionQuery.data?.data?.total_rt || 0} / {regionQuery.data?.data?.total_rw || 0}
						</div>
					</div>

					{#if regionQuery.data?.data?.north_border || regionQuery.data?.data?.east_border || regionQuery.data?.data?.south_border || regionQuery.data?.data?.west_border}
						<div>
							<span
								class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400"
								>Batas Perbatasan</span
							>
							<div class="grid grid-cols-2 gap-1.5 text-[11px]">
								{#if regionQuery.data?.data?.north_border}
									<div
										class="flex items-center gap-1.5 rounded border border-slate-100 bg-slate-50 px-2 py-1 text-slate-600"
									>
										<span class="text-[10px] font-bold text-slate-400">U:</span>
										<span class="truncate font-medium">{regionQuery.data.data.north_border}</span>
									</div>
								{/if}
								{#if regionQuery.data?.data?.east_border}
									<div
										class="flex items-center gap-1.5 rounded border border-slate-100 bg-slate-50 px-2 py-1 text-slate-600"
									>
										<span class="text-[10px] font-bold text-slate-400">T:</span>
										<span class="truncate font-medium">{regionQuery.data.data.east_border}</span>
									</div>
								{/if}
								{#if regionQuery.data?.data?.south_border}
									<div
										class="flex items-center gap-1.5 rounded border border-slate-100 bg-slate-50 px-2 py-1 text-slate-600"
									>
										<span class="text-[10px] font-bold text-slate-400">S:</span>
										<span class="truncate font-medium">{regionQuery.data.data.south_border}</span>
									</div>
								{/if}
								{#if regionQuery.data?.data?.west_border}
									<div
										class="flex items-center gap-1.5 rounded border border-slate-100 bg-slate-50 px-2 py-1 text-slate-600"
									>
										<span class="text-[10px] font-bold text-slate-400">B:</span>
										<span class="truncate font-medium">{regionQuery.data.data.west_border}</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</section>

		<!-- Pemerintahan Card -->
		<section
			class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
		>
			<div class="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 p-4">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100/80 text-violet-600 shadow-xs"
				>
					<Landmark size={18} />
				</div>
				<div>
					<h3 class="text-sm font-bold text-slate-900">Pemerintahan</h3>
					<p class="text-[11px] font-medium text-slate-500">Struktur & aparatur aktif</p>
				</div>
			</div>
			<div class="p-4 space-y-3">
				{#if governmentQuery.isPending}
					<div class="flex items-center gap-2 py-2 text-xs font-semibold text-slate-400">
						<Loader2 size={16} class="animate-spin text-violet-500" /> Memuat data pemerintahan...
					</div>
				{:else if governmentQuery.data?.data && governmentQuery.data.data.length > 0}
					<div class="space-y-2">
						{#each governmentQuery.data.data.slice(0, 4) as member, index (index)}
							<div
								class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-2.5"
							>
								<div class="flex items-center gap-2.5">
									<div
										class="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700"
									>
										{member.name ? member.name.charAt(0).toUpperCase() : '?'}
									</div>
									<div>
										<h4 class="text-xs font-bold text-slate-800">{member.name}</h4>
										<p class="text-[11px] font-medium text-slate-500">
											{formatPosition(member.position)}
										</p>
									</div>
								</div>
								<span
									class="rounded bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 uppercase"
								>
									Aktif
								</span>
							</div>
						{/each}
						{#if governmentQuery.data.data.length > 4}
							<p class="pt-1 text-center text-[11px] font-semibold text-slate-400">
								+{governmentQuery.data.data.length - 4} aparatur lainnya
							</p>
						{/if}
					</div>
				{:else}
					<p class="text-xs font-medium italic text-slate-400">Belum ada data pemerintahan.</p>
				{/if}
			</div>
		</section>

		<!-- Potensi Sumber Daya Card -->
		<section
			class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
		>
			<div class="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 p-4">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100/80 text-amber-600 shadow-xs"
				>
					<Sparkles size={18} />
				</div>
				<div>
					<h3 class="text-sm font-bold text-slate-900">Potensi Sumber Daya</h3>
					<p class="text-[11px] font-medium text-slate-500">Keunggulan & potensi desa</p>
				</div>
			</div>
			<div class="p-4 space-y-2">
				{#if resourceQuery.isPending}
					<div class="flex items-center gap-2 py-2 text-xs font-semibold text-slate-400">
						<Loader2 size={16} class="animate-spin text-amber-500" /> Memuat potensi...
					</div>
				{:else if resourceQuery.data?.data?.title}
					<div class="rounded-lg border border-amber-100 bg-amber-50/40 p-3">
						<span
							class="mb-1.5 inline-block rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800"
						>
							{resourceQuery.data.data.title}
						</span>
						{#if resourceQuery.data.data.detail}
							<p class="text-xs leading-relaxed text-slate-600">
								{resourceQuery.data.data.detail}
							</p>
						{/if}
					</div>
				{:else}
					<p class="text-xs font-medium italic text-slate-400">Belum ada potensi sumber daya.</p>
				{/if}
			</div>
		</section>
	</aside>
</div>

<!-- Modal Dialog Add / Edit Official -->
<Dialog
	bind:isOpen={isOfficialDialogOpen}
	title={editingOfficial ? 'Ubah Data Perangkat Desa' : 'Tambah Perangkat Desa Baru'}
	subtitle={editingOfficial ? `ID: ${editingOfficial.id}` : 'Isi form informasi perangkat desa'}
>
	<form onsubmit={handleSaveOfficial} class="flex flex-col p-6 space-y-4">
		<div class="grid gap-4 md:grid-cols-2">
			<div class="space-y-1.5">
				<label for="off-name" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>Nama Lengkap</label
				>
				<Input
					id="off-name"
					bind:value={officialForm.name}
					required
					placeholder="Contoh: Budi Santoso, S.IP"
				/>
			</div>
			<div class="space-y-1.5">
				<label for="off-pos" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>Jabatan</label
				>
				<Input
					id="off-pos"
					bind:value={officialForm.position}
					required
					placeholder="Contoh: sekretaris-desa"
				/>
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-2 items-center">
			<div class="space-y-1.5">
				<label
					for="off-order"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>No Urut / Order</label
				>
				<Input id="off-order" type="number" bind:value={officialForm.order_number} />
			</div>
			<div class="flex items-center gap-2 pt-5">
				<label class="flex items-center gap-2 text-xs font-bold text-slate-600">
					<input
						type="checkbox"
						bind:checked={officialForm.is_active}
						class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
					/>
					Status Aktif
				</label>
			</div>
		</div>

		<div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
			<Button
				variant="outline"
				onclick={() => (isOfficialDialogOpen = false)}
				disabled={isSavingOfficial}>Batal</Button
			>
			<Button type="submit" disabled={isSavingOfficial}>
				{#if isSavingOfficial}
					<Loader2 size={16} class="animate-spin" />
					Menyimpan...
				{:else}
					Simpan Perangkat Desa
				{/if}
			</Button>
		</div>
	</form>
</Dialog>

<ConfirmDialog
	bind:isOpen={isDeleteOfficialDialogOpen}
	title="Hapus Perangkat Desa"
	description="Apakah Anda yakin ingin menghapus data perangkat desa ini? Tindakan ini tidak dapat dibatalkan."
	isLoading={isDeletingOfficial}
	onConfirm={confirmDeleteOfficial}
/>
