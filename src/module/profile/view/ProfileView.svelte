<script lang="ts">
	import {
		getGovernmentStructure,
		getRegionBoundary,
		getResourcePotential,
		getVisionMission,
		saveProfile
	} from '../_request';
	import { createQuery } from '@tanstack/svelte-query';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import { Loader2, Plus, Trash2 } from '@lucide/svelte';

	type HeadmanForm = {
		name: string;
		position: string;
		start_date: string;
		finish_date: string;
		is_active: boolean;
	};

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
		population: '',
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
	let isSaving = $state(false);

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
			hamlet_one: form.hamlet_one || undefined,
			hamlet_two: form.hamlet_two || undefined,
			north_border: form.north_border || undefined,
			east_border: form.east_border || undefined,
			south_border: form.south_border || undefined,
			west_border: form.west_border || undefined,
			area: form.area || undefined,
			population: form.population || undefined,
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
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
	<form onsubmit={save} class="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
		<div>
			<h2 class="text-base font-bold text-slate-900">Pengelolaan Profil Desa</h2>
			<p class="mt-1 text-xs font-medium text-slate-500">
				Kelola identitas, visi misi, wilayah, dan kepala desa.
			</p>
		</div>
		<div class="grid gap-4 md:grid-cols-3">
			<Input bind:value={form.name} placeholder="Nama desa" required />
			<Input bind:value={form.province} placeholder="Provinsi" required />
			<Input bind:value={form.regency} placeholder="Kabupaten" required />
			<Input bind:value={form.district} placeholder="Kecamatan" required />
			<Input bind:value={form.postal_code} placeholder="Kode pos" />
			<Input bind:value={form.phone} placeholder="Telepon" />
			<Input bind:value={form.email} placeholder="Email" />
			<Input bind:value={form.region} placeholder="Wilayah" />
			<Input bind:value={form.hamlet_one} placeholder="Dusun 1" />
			<Input bind:value={form.hamlet_two} placeholder="Dusun 2" />
			<Input bind:value={form.north_border} placeholder="Batas utara" />
			<Input bind:value={form.east_border} placeholder="Batas timur" />
			<Input bind:value={form.south_border} placeholder="Batas selatan" />
			<Input bind:value={form.west_border} placeholder="Batas barat" />
			<Input bind:value={form.area} placeholder="Luas wilayah" />
			<Input bind:value={form.population} placeholder="Populasi" />
			<Input bind:value={form.latitude} placeholder="Latitude" />
			<Input bind:value={form.longitude} placeholder="Longitude" />
		</div>
		<Input bind:value={form.address} placeholder="Alamat" required />
		<Textarea bind:value={form.description} placeholder="Deskripsi desa" rows={3} />
		<Textarea bind:value={form.history} placeholder="Sejarah" rows={3} />
		<Textarea bind:value={form.vision} placeholder="Visi" rows={3} />
		<Textarea bind:value={form.mission} placeholder="Misi, satu baris per poin" rows={5} />

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
							<Input bind:value={headman.name} placeholder="Nama kepala desa" />
							<Input bind:value={headman.position} placeholder="Jabatan" />
							<Input type="date" bind:value={headman.start_date} placeholder="Tanggal mulai" />
							<Input type="date" bind:value={headman.finish_date} placeholder="Tanggal selesai" />
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
				{regionQuery.data?.data?.area || '-'} · {regionQuery.data?.data?.population || '-'}
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
