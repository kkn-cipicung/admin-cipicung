<script lang="ts">
	import type { BusinessData } from '../_model/response';
	import { createBusiness, deleteBusiness, listBusinesses, updateBusiness } from '../_request';
	import { listCategories } from '../../category/_request';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import {
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell
	} from '$lib/components/ui/table';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import CategorySelect from '$lib/components/ui/CategorySelect.svelte';
	import { Loader2, Pencil, Phone, Plus, Search, Trash2 } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';

	const queryClient = useQueryClient();
	const businessesQuery = createQuery(() => ({
		queryKey: ['businesses', 'list'],
		queryFn: () => listBusinesses()
	}));
	const categoriesQuery = createQuery(() => ({
		queryKey: ['categories', 'list', 'business'],
		queryFn: () => listCategories()
	}));

	let businesses = $derived(businessesQuery.data?.data || []);
	let categories = $derived(
		(categoriesQuery.data?.data || []).filter((category) => category.type === 'business')
	);
	let isLoading = $derived(businessesQuery.isPending || categoriesQuery.isPending);
	let searchQuery = $state('');
	let selectedCategoryId = $state<number | string>('');

	let isDialogOpen = $state(false);
	let editingItem = $state<BusinessData | null>(null);
	let editForm = $state({
		category_id: 0,
		owner_name: '',
		business_name: '',
		description: '',
		phone: '',
		address: '',
		instagram: '',
		facebook: ''
	});

	let filteredBusinesses = $derived(
		businesses.filter((business) => {
			const query = searchQuery.toLowerCase();
			const matchesSearch = searchQuery
				? business.business_name.toLowerCase().includes(query) ||
					business.owner_name.toLowerCase().includes(query) ||
					business.phone.toLowerCase().includes(query) ||
					business.address.toLowerCase().includes(query)
				: true;
			const matchesCategory = selectedCategoryId
				? business.category.id === Number(selectedCategoryId)
				: true;

			return matchesSearch && matchesCategory;
		})
	);

	function getDefaultCategoryId() {
		return categories.length > 0 ? categories[0].id : 0;
	}

	function handleCreate() {
		editingItem = null;
		editForm = {
			category_id: getDefaultCategoryId(),
			owner_name: '',
			business_name: '',
			description: '',
			phone: '',
			address: '',
			instagram: '',
			facebook: ''
		};
		isDialogOpen = true;
	}

	function handleEdit(item: BusinessData) {
		editingItem = item;
		editForm = {
			category_id: item.category.id,
			owner_name: item.owner_name,
			business_name: item.business_name,
			description: item.description,
			phone: item.phone,
			address: item.address,
			instagram: item.instagram || '',
			facebook: item.facebook || ''
		};
		isDialogOpen = true;
	}

	async function handleSave(e: Event) {
		e.preventDefault();

		const optionalInstagram = editForm.instagram.trim() || null;
		const optionalFacebook = editForm.facebook.trim() || null;

		try {
			if (editingItem) {
				await updateBusiness({
					id: editingItem.id,
					category_id: Number(editForm.category_id),
					owner_name: editForm.owner_name,
					business_name: editForm.business_name,
					description: editForm.description,
					phone: editForm.phone,
					address: editForm.address,
					instagram: optionalInstagram,
					facebook: optionalFacebook
				});
			} else {
				await createBusiness({
					category_id: Number(editForm.category_id),
					owner_name: editForm.owner_name,
					business_name: editForm.business_name,
					description: editForm.description,
					phone: editForm.phone,
					address: editForm.address,
					instagram: optionalInstagram,
					facebook: optionalFacebook
				});
			}

			isDialogOpen = false;
			editingItem = null;
			await queryClient.invalidateQueries({ queryKey: ['businesses', 'list'] });
			toast.success('Data bisnis berhasil disimpan!');
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menyimpan bisnis', message: msg });
		}
	}

	async function handleDelete(id: number) {
		if (confirm('Apakah Anda yakin ingin menghapus data bisnis ini?')) {
			try {
				await deleteBusiness({ id });
				await queryClient.invalidateQueries({ queryKey: ['businesses', 'list'] });
				toast.success('Data bisnis berhasil dihapus.');
			} catch (error) {
				const err = error as { apiResponse?: { message?: string }; message?: string };
				const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
				toast.error({ title: 'Gagal menghapus bisnis', message: msg });
			}
		}
	}

	function getCategoryName(categoryId: number) {
		const category = categories.find((item) => item.id === categoryId);
		return category ? category.name : `#${categoryId}`;
	}

	function formatDate(isoString?: string) {
		if (!isoString) return '-';

		return new Date(isoString).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-base font-bold text-slate-900">Pengelolaan Bisnis & UMKM</h2>
			<p class="text-xs font-medium text-slate-500 mt-0.5">
				Kelola profil usaha, kontak pemilik, alamat, dan kanal sosial bisnis desa.
			</p>
		</div>
		<Button onclick={handleCreate}>
			<Plus size={16} strokeWidth={2.5} />
			Tambah Bisnis
		</Button>
	</div>

	<div
		class="flex flex-col gap-4 md:flex-row md:items-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
	>
		<div class="relative flex-1">
			<span class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
				<Search size={16} />
			</span>
			<Input
				placeholder="Cari nama bisnis, pemilik, nomor telepon, atau alamat..."
				class="pl-9 bg-slate-50/50"
				bind:value={searchQuery}
			/>
		</div>

		<CategorySelect
			bind:value={selectedCategoryId}
			{categories}
			allLabel="Semua Kategori"
			class="bg-slate-50/50 md:w-56"
		/>
	</div>

	{#if isLoading}
		<div class="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-250">
			<div class="flex items-center gap-3 text-slate-500 font-semibold text-sm">
				<Loader2 size={20} class="animate-spin" />
				Memuat data bisnis...
			</div>
		</div>
	{:else}
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead class="w-16 text-center">No</TableHead>
					<TableHead>Bisnis</TableHead>
					<TableHead>Pemilik & Kontak</TableHead>
					<TableHead>Deskripsi</TableHead>
					<TableHead>Alamat</TableHead>
					<TableHead class="text-center">Kategori</TableHead>
					<TableHead>Sosial</TableHead>
					<TableHead>Tanggal Dibuat</TableHead>
					<TableHead class="text-right">Aksi</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if filteredBusinesses.length === 0}
					<TableRow>
						<TableCell colspan={9} class="text-center py-8 text-slate-400 font-medium">
							Belum ada data bisnis.
						</TableCell>
					</TableRow>
				{:else}
					{#each filteredBusinesses as business, index (business.id)}
						<TableRow>
							<TableCell class="text-center font-bold text-slate-400">{index + 1}</TableCell>
							<TableCell class="font-bold text-slate-900 max-w-[12rem] truncate">
								{business.business_name}
							</TableCell>
							<TableCell class="text-xs">
								<span class="block font-bold text-slate-900">{business.owner_name}</span>
								<span
									class="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-slate-400"
								>
									<Phone size={12} />
									{business.phone}
								</span>
							</TableCell>
							<TableCell class="max-w-xs text-xs text-slate-500 line-clamp-1 py-5">
								{business.description}
							</TableCell>
							<TableCell class="max-w-[14rem] text-xs text-slate-500 line-clamp-1 py-5">
								{business.address}
							</TableCell>
							<TableCell class="text-center">
								<span
									class="inline-flex h-6 px-2.5 items-center justify-center rounded bg-amber-50 text-xs font-bold text-amber-700"
								>
									{business.category.name || getCategoryName(business.category.id)}
								</span>
							</TableCell>
							<TableCell class="text-xs">
								<span class="block text-slate-500">{business.instagram || '-'}</span>
								<span class="block text-slate-400">{business.facebook || '-'}</span>
							</TableCell>
							<TableCell class="text-xs text-slate-500 whitespace-nowrap">
								{formatDate(business.created_at)}
							</TableCell>
							<TableCell class="text-right whitespace-nowrap">
								<div class="flex items-center justify-end gap-2">
									<Button
										variant="outline"
										size="icon"
										onclick={() => handleEdit(business)}
										title="Ubah Bisnis"
									>
										<Pencil size={14} />
									</Button>
									<Button
										variant="outline"
										size="icon"
										class="hover:bg-red-50 hover:text-red-650 hover:border-red-200"
										title="Hapus Bisnis"
										onclick={() => handleDelete(business.id)}
									>
										<Trash2 size={14} />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					{/each}
				{/if}
			</TableBody>
		</Table>
	{/if}
</div>

<Dialog
	bind:isOpen={isDialogOpen}
	title={editingItem ? 'Ubah Data Bisnis' : 'Tambah Bisnis Baru'}
	subtitle={editingItem
		? `ID: ${editingItem.id} | Mengubah profil bisnis`
		: 'Tambah profil UMKM baru'}
	maxWidth="max-w-2xl"
>
	<form onsubmit={handleSave} class="flex flex-col p-6 space-y-4 max-h-[70vh] overflow-y-auto">
		<div class="grid gap-4 md:grid-cols-2">
			<div class="space-y-1.5">
				<label
					for="edit-business-name"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Bisnis</label
				>
				<Input id="edit-business-name" bind:value={editForm.business_name} required />
			</div>
			<div class="space-y-1.5">
				<label
					for="edit-owner-name"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Pemilik</label
				>
				<Input id="edit-owner-name" bind:value={editForm.owner_name} required />
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			<div class="space-y-1.5">
				<label
					for="edit-category"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Kategori</label
				>
				<CategorySelect
					id="edit-category"
					bind:value={editForm.category_id}
					{categories}
					required
				/>
			</div>
			<div class="space-y-1.5">
				<label
					for="edit-phone"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide">No. Telepon</label
				>
				<Input id="edit-phone" bind:value={editForm.phone} required />
			</div>
		</div>

		<div class="space-y-1.5">
			<label
				for="edit-description"
				class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Deskripsi</label
			>
			<Textarea id="edit-description" bind:value={editForm.description} rows={3} required />
		</div>

		<div class="space-y-1.5">
			<label
				for="edit-address"
				class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Alamat</label
			>
			<Textarea id="edit-address" bind:value={editForm.address} rows={2} required />
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			<div class="space-y-1.5">
				<label
					for="edit-instagram"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Instagram</label
				>
				<Input id="edit-instagram" bind:value={editForm.instagram} placeholder="@namausaha" />
			</div>
			<div class="space-y-1.5">
				<label
					for="edit-facebook"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Facebook</label
				>
				<Input id="edit-facebook" bind:value={editForm.facebook} placeholder="Nama halaman" />
			</div>
		</div>

		<div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
			<Button variant="outline" onclick={() => (isDialogOpen = false)}>Batal</Button>
			<Button type="submit">Simpan Perubahan</Button>
		</div>
	</form>
</Dialog>
