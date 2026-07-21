<script lang="ts">
	import { createMap, updateMap, getActiveMap } from '../_request';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { Loader2 } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';

	const queryClient = useQueryClient();
	const mapQuery = createQuery(() => ({
		queryKey: ['map', 'active'],
		queryFn: getActiveMap,
		retry: false
	}));
	let form = $state({ elevation: '', coordinate: '', hamlet_one: '', hamlet_two: '' });
	let hasHydrated = $state(false);
	let isSaving = $state(false);

	$effect(() => {
		const data = mapQuery.data?.data;
		if (data && !hasHydrated) {
			form = {
				elevation: data.elevation,
				coordinate: data.coordinate,
				hamlet_one: String(data.hamlet_one),
				hamlet_two: String(data.hamlet_two)
			};
			hasHydrated = true;
		}
	});

	async function save(event: Event) {
		event.preventDefault();
		isSaving = true;
		const payload = {
			...form,
			hamlet_one: Number(form.hamlet_one),
			hamlet_two: Number(form.hamlet_two)
		};
		try {
			if (hasHydrated) await updateMap(payload);
			else await createMap(payload);
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

<form
	onsubmit={save}
	class="max-w-2xl space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
>
	<div>
		<h2 class="text-base font-bold text-slate-900">Pengelolaan Peta</h2>
		<p class="mt-1 text-xs font-medium text-slate-500">
			Kelola elevasi, koordinat, dan informasi dusun yang tampil di halaman peta.
		</p>
	</div>
	{#if mapQuery.isPending}
		<div class="flex items-center gap-2 text-sm text-slate-500">
			<Loader2 size={18} class="animate-spin" />Memuat data peta...
		</div>
	{/if}
	<Input bind:value={form.elevation} placeholder="Elevasi" required />
	<Input bind:value={form.coordinate} placeholder="Koordinat" required />
	<Input type="number" bind:value={form.hamlet_one} placeholder="Dusun 1" required />
	<Input type="number" bind:value={form.hamlet_two} placeholder="Dusun 2" required />
	<div class="flex justify-end">
		<Button type="submit" disabled={isSaving}>{isSaving ? 'Menyimpan...' : 'Simpan Peta'}</Button>
	</div>
</form>
