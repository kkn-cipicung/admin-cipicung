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
	import { Loader2, Pencil, Plus, Trash2 } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';

	type HeadmanForm = {
		name: string;
		position: string;
		start_date: string;
		finish_date: string;
		is_active: boolean;
	};

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
		phone: '',
		email: '',
		description: '',
		order_number: 1,
		is_active: true,
		start_date: '',
		finish_date: ''
	});

	function handleCreateOfficial() {
		editingOfficial = null;
		officialForm = {
			name: '',
			position: '',
			phone: '',
			email: '',
			description: '',
			order_number: officials.length + 1,
			is_active: true,
			start_date: '',
			finish_date: ''
		};
		isOfficialDialogOpen = true;
	}

	function handleEditOfficial(item: OfficialData) {
		editingOfficial = item;
		officialForm = {
			name: item.name,
			position: item.position,
			phone: item.phone || '',
			email: item.email || '',
			description: item.description || '',
			order_number: item.order_number || 1,
			is_active: Boolean(item.is_active),
			start_date: item.start_date || '',
			finish_date: item.finish_date || ''
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
				phone: officialForm.phone || undefined,
				email: officialForm.email || undefined,
				description: officialForm.description || undefined,
				order_number: Number(officialForm.order_number) || 1,
				is_active: officialForm.is_active,
				start_date: officialForm.start_date || undefined,
				finish_date: officialForm.finish_date || null
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
		<form onsubmit={save} class="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
				<FloatingInput type="number" bind:value={form.hamlet_one} label="Populasi Dusun 1" />
				<FloatingInput type="number" bind:value={form.hamlet_two} label="Populasi Dusun 2" />
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
								<FloatingInput type="date" bind:value={headman.finish_date} label="Tanggal selesai" />
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
				<div class="flex items-center justify-center p-8 text-xs font-semibold text-slate-400 gap-2">
					<Loader2 size={16} class="animate-spin" /> Memuat daftar perangkat desa...
				</div>
			{:else if officials.length === 0}
				<div class="rounded-lg border border-dashed border-slate-200 p-8 text-center text-xs font-medium text-slate-400">
					Belum ada data perangkat desa. Klik tombol di atas untuk menambah.
				</div>
			{:else}
				<div class="divide-y divide-slate-100 rounded-lg border border-slate-200">
					{#each officials as item (item.id)}
						<div class="flex items-center justify-between p-4 hover:bg-slate-50/50">
							<div>
								<div class="flex items-center gap-2">
									<h4 class="text-sm font-bold text-slate-900">{item.name}</h4>
									<span class="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
										{item.position}
									</span>
									{#if item.is_active}
										<span class="rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 uppercase">
											Aktif
										</span>
									{/if}
								</div>
								<p class="mt-1 text-xs text-slate-500">
									{item.phone ? `HP: ${item.phone}` : ''} {item.email ? `| Email: ${item.email}` : ''}
									{item.start_date ? `| Masa: ${item.start_date} s/d ${item.finish_date || 'Sekarang'}` : ''}
								</p>
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

	<aside class="space-y-4">
		<section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
			<h3 class="text-sm font-bold text-slate-900">Visi Aktif</h3>
			{#if visionQuery.isPending}
				<p class="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
					<Loader2 size={16} class="animate-spin" />Memuat...
				</p>
			{:else}
				<p class="mt-3 text-xs font-semibold text-slate-500">
					{visionQuery.data?.data?.vision || '-'}
				</p>
			{/if}
		</section>
		<section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
			<h3 class="text-sm font-bold text-slate-900">Wilayah</h3>
			<p class="mt-3 text-xs font-semibold text-slate-500">
				{regionQuery.data?.data?.region || '-'}<br />
				{regionQuery.data?.data?.area || '-'}
			</p>
		</section>
		<section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
			<h3 class="text-sm font-bold text-slate-900">Pemerintahan</h3>
			<p class="mt-3 text-xs font-semibold text-slate-500">
				{governmentQuery.data?.data?.[0]?.name || '-'}<br />
				{governmentQuery.data?.data?.[0]?.position || ''}
			</p>
		</section>
		<section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
			<h3 class="text-sm font-bold text-slate-900">Potensi Sumber Daya</h3>
			<p class="mt-3 text-xs font-semibold text-slate-500">
				{resourceQuery.data?.data?.title || '-'}<br />
				{resourceQuery.data?.data?.detail || ''}
			</p>
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
				<label for="off-name" class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Lengkap</label>
				<Input id="off-name" bind:value={officialForm.name} required placeholder="Contoh: Budi Santoso, S.IP" />
			</div>
			<div class="space-y-1.5">
				<label for="off-pos" class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Jabatan</label>
				<Input id="off-pos" bind:value={officialForm.position} required placeholder="Contoh: sekretaris-desa" />
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			<div class="space-y-1.5">
				<label for="off-phone" class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Telepon / HP</label>
				<Input id="off-phone" bind:value={officialForm.phone} placeholder="08123456789" />
			</div>
			<div class="space-y-1.5">
				<label for="off-email" class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Email</label>
				<Input id="off-email" type="email" bind:value={officialForm.email} placeholder="sekdes@cipicung.id" />
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			<div class="space-y-1.5">
				<label for="off-start" class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Tanggal Mulai</label>
				<Input id="off-start" type="date" bind:value={officialForm.start_date} />
			</div>
			<div class="space-y-1.5">
				<label for="off-finish" class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Tanggal Selesai</label>
				<Input id="off-finish" type="date" bind:value={officialForm.finish_date} />
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-2 items-center">
			<div class="space-y-1.5">
				<label for="off-order" class="block text-xs font-bold text-slate-500 uppercase tracking-wide">No Urut / Order</label>
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

		<div class="space-y-1.5">
			<label for="off-desc" class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Keterangan / Deskripsi</label>
			<Input id="off-desc" bind:value={officialForm.description} placeholder="Deskripsi tugas atau periode" />
		</div>

		<div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
			<Button variant="outline" onclick={() => (isOfficialDialogOpen = false)} disabled={isSavingOfficial}>Batal</Button>
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
