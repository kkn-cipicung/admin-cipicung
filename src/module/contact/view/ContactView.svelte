<script lang="ts">
	import { createContact, getContactDetail, updateContact } from '../_request';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { Loader2 } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';

	const queryClient = useQueryClient();
	const contactQuery = createQuery(() => ({
		queryKey: ['contact', 'detail'],
		queryFn: getContactDetail,
		retry: false
	}));

	let form = $state({
		id: 0,
		name: '',
		province: '',
		regency: '',
		district: '',
		address: '',
		postal_code: '',
		phone: '',
		email: ''
	});
	let hasHydrated = $state(false);
	let isSaving = $state(false);
	let contactDetail = $derived(contactQuery.data?.data);

	$effect(() => {
		const data = contactDetail;
		if (data && !hasHydrated) {
			form = {
				id: (data as { id?: number }).id || 0,
				name: data.office?.name || '',
				province: data.office?.province || '',
				regency: data.office?.regency || '',
				district: data.office?.district || '',
				address: data.office?.address || '',
				postal_code: data.office?.postal_code || '',
				phone: data.contact?.phone || '',
				email: data.contact?.email || ''
			};
			hasHydrated = true;
		}
	});

	async function save(event: Event) {
		event.preventDefault();
		isSaving = true;
		const { id, ...payload } = form;
		try {
			if (id) await updateContact({ id: Number(id), ...payload });
			else await createContact(payload);
			await queryClient.invalidateQueries({ queryKey: ['contact', 'detail'] });
			toast.success('Kontak berhasil disimpan!');
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menyimpan kontak', message: msg });
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
	<form onsubmit={save} class="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
		<div>
			<h2 class="text-base font-bold text-slate-900">Pengelolaan Kontak</h2>
			<p class="mt-1 text-xs font-medium text-slate-500">
				Kelola alamat kantor dan kanal kontak desa.
			</p>
		</div>
		<div class="grid gap-4 md:grid-cols-2">
			<Input bind:value={form.name} placeholder="Nama kantor" required />
			<Input bind:value={form.province} placeholder="Provinsi" required />
			<Input bind:value={form.regency} placeholder="Kabupaten" required />
			<Input bind:value={form.district} placeholder="Kecamatan" required />
			<Input bind:value={form.postal_code} placeholder="Kode pos" required />
			<Input bind:value={form.phone} placeholder="Telepon" required />
			<Input bind:value={form.email} placeholder="Email" required />
		</div>
		<Textarea rows={3} bind:value={form.address} placeholder="Alamat" required />
		<div class="flex justify-end">
			<Button type="submit" disabled={isSaving}
				>{isSaving ? 'Menyimpan...' : 'Simpan Kontak'}</Button
			>
		</div>
	</form>

	<aside class="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
		<h3 class="text-sm font-bold text-slate-900">Data Kontak Aktif</h3>
		{#if contactQuery.isPending}
			<div class="flex items-center gap-2 text-xs font-semibold text-slate-500">
				<Loader2 size={16} class="animate-spin" />Memuat kontak...
			</div>
		{:else if contactDetail}
			<div class="space-y-3 text-xs font-semibold text-slate-500">
				<p>
					<span class="block text-slate-900">{contactDetail.office.name}</span>
					{contactDetail.office.address}
				</p>
				<p>
					{contactDetail.office.district}, {contactDetail.office.regency},
					{contactDetail.office.province}
					{contactDetail.office.postal_code}
				</p>
				<p>
					{contactDetail.contact.phone || '-'}<br />
					{contactDetail.contact.email || '-'}
				</p>
			</div>
		{:else}
			<p class="text-xs font-semibold text-slate-400">Belum ada data kontak aktif.</p>
		{/if}
	</aside>
</div>
