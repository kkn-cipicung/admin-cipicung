<script lang="ts">
	import { createMap, updateMap, getActiveMap } from '../_request';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { Loader2, MapPin, Mountain, Save } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';

	const queryClient = useQueryClient();
	const mapQuery = createQuery(() => ({
		queryKey: ['map', 'active'],
		queryFn: getActiveMap,
		retry: false
	}));

	let mapId = $state<number | null>(null);
	let form = $state({ elevation: '', coordinate: '' });
	let hasHydrated = $state(false);
	let isSaving = $state(false);

	$effect(() => {
		const data = mapQuery.data?.data;
		if (data && !hasHydrated) {
			if (data.id) mapId = data.id;
			form = {
				elevation: data.elevation || '',
				coordinate: data.coordinate || ''
			};
			hasHydrated = true;
		}
	});

	async function save(event: Event) {
		event.preventDefault();
		isSaving = true;

		const payload = {
			elevation: form.elevation.trim(),
			coordinate: form.coordinate.trim()
		};

		try {
			if (mapId) {
				await updateMap({ id: mapId, ...payload });
			} else {
				await createMap(payload);
			}
			await queryClient.invalidateQueries({ queryKey: ['map', 'active'] });
			toast.success('Data peta berhasil disimpan!');
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menyimpan peta', message: msg });
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
	<form
		onsubmit={save}
		class="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
	>
		<div class="flex items-center justify-between border-b border-slate-100 pb-4">
			<div>
				<h2 class="text-base font-bold text-slate-900">Pengelolaan Peta</h2>
				<p class="mt-0.5 text-xs font-medium text-slate-500">
					Kelola elevasi dan koordinat peta lokasi desa.
				</p>
			</div>
			{#if mapQuery.isPending}
				<div class="flex items-center gap-2 text-xs font-semibold text-slate-400">
					<Loader2 size={16} class="animate-spin" />Memuat data...
				</div>
			{/if}
		</div>

		<div class="grid gap-5 md:grid-cols-2">
			<div class="space-y-1.5">
				<label for="map-elevation" class="block text-xs font-bold text-slate-500 uppercase tracking-wide">
					Elevasi (mdpl)
				</label>
				<Input
					id="map-elevation"
					bind:value={form.elevation}
					placeholder="Contoh: 120 mdpl"
					required
				/>
			</div>

			<div class="space-y-1.5">
				<label for="map-coordinate" class="block text-xs font-bold text-slate-500 uppercase tracking-wide">
					Koordinat Lokasi
				</label>
				<Input
					id="map-coordinate"
					bind:value={form.coordinate}
					placeholder="Contoh: -6.5561, 107.4421"
					required
				/>
			</div>
		</div>

		<div class="pt-4 border-t border-slate-100 flex items-center justify-end">
			<Button type="submit" disabled={isSaving}>
				{#if isSaving}
					<Loader2 size={16} class="animate-spin" />
					Menyimpan...
				{:else}
					<Save size={16} />
					Simpan Data Peta
				{/if}
			</Button>
		</div>
	</form>

	<aside class="space-y-4">
		<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
			<h3 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Ringkasan Data Aktif</h3>
			<div class="space-y-3.5">
				<div class="flex items-start gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
						<Mountain size={18} />
					</div>
					<div>
						<div class="text-[11px] font-bold text-slate-400 uppercase">Elevasi Desa</div>
						<div class="text-sm font-bold text-slate-900">{form.elevation || '-'}</div>
					</div>
				</div>

				<div class="flex items-start gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
						<MapPin size={18} />
					</div>
					<div>
						<div class="text-[11px] font-bold text-slate-400 uppercase">Koordinat GPS</div>
						<div class="text-sm font-mono font-bold text-slate-900">{form.coordinate || '-'}</div>
					</div>
				</div>
			</div>
		</div>
	</aside>
</div>
