<script lang="ts">
	import type { PotentialData } from '../_model/response';
	import { listPotentials, createPotential, updatePotential, deletePotential } from '../_request';
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
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import CategorySelect from '$lib/components/ui/CategorySelect.svelte';
	import MediaThumbnail from '$lib/components/ui/MediaThumbnail.svelte';
	import { Plus, Search, Loader2, Pencil, Trash2 } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';

	const queryClient = useQueryClient();
	const potentialsQuery = createQuery(() => ({
		queryKey: ['potentials', 'list'],
		queryFn: () => listPotentials()
	}));
	const categoriesQuery = createQuery(() => ({
		queryKey: ['categories', 'list', 'potential'],
		queryFn: () => listCategories()
	}));

	let potentials = $derived(potentialsQuery.data?.data || []);
	let categories = $derived(categoriesQuery.data?.data || []);
	let isLoading = $derived(potentialsQuery.isPending || categoriesQuery.isPending);
	let searchQuery = $state('');
	let filteredPotentials = $derived(
		potentials.filter((item) => {
			const query = searchQuery.toLowerCase();
			return searchQuery
				? item.title.toLowerCase().includes(query) ||
						(item.subtitle || '').toLowerCase().includes(query) ||
						item.description.toLowerCase().includes(query)
				: true;
		})
	);

	let isDialogOpen = $state(false);
	let editingItem = $state<PotentialData | null>(null);
	let isPreparingForm = $state(false);
	let isSaving = $state(false);
	let isDeleteDialogOpen = $state(false);
	let isDeleting = $state(false);
	let deleteTargetId = $state<number | null>(null);
	let editForm = $state({
		title: '',
		subtitle: '',
		slug: '',
		description: '',
		category_id: 0,
		media_id: ''
	});

	async function handleCreate() {
		isPreparingForm = true;
		const categoryResult = categories.length > 0 ? null : await categoriesQuery.refetch();
		const latestCategories = categoryResult?.data?.data || categories;

		editingItem = null;
		editForm = {
			title: '',
			subtitle: '',
			slug: '',
			description: '',
			category_id: getDefaultCategoryId(latestCategories),
			media_id: ''
		};
		isDialogOpen = true;
		isPreparingForm = false;
	}

	function getCategoryName(categoryId: number) {
		const category = categories.find((item) => item.id === categoryId);
		return category ? category.name : `#${categoryId}`;
	}

	function getDefaultCategoryId(items = categories) {
		return items.length > 0 ? items[0].id : 0;
	}

	function handleEdit(item: PotentialData) {
		editingItem = item;
		editForm = {
			title: item.title,
			subtitle: item.subtitle || '',
			slug: item.slug,
			description: item.description,
			category_id: item.category.id,
			media_id: item.media_id ? String(item.media_id) : item.media || ''
		};
		isDialogOpen = true;
	}

	async function handleSave(e: Event) {
		e.preventDefault();
		if (isSaving) return;
		isSaving = true;
		const mediaId = editForm.media_id.trim();
		try {
			if (editingItem) {
				await updatePotential({
					id: editingItem.id,
					category_id: Number(editForm.category_id),
					title: editForm.title,
					subtitle: editForm.subtitle,
					slug: editForm.slug,
					description: editForm.description,
					media_id: mediaId || null
				});
			} else {
				await createPotential({
					category_id: Number(editForm.category_id),
					title: editForm.title,
					subtitle: editForm.subtitle,
					slug: editForm.slug,
					description: editForm.description,
					media_id: mediaId || null
				});
			}
			isDialogOpen = false;
			editingItem = null;
			await queryClient.invalidateQueries({ queryKey: ['potentials', 'list'] });
			toast.success('Potensi berhasil disimpan!');
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menyimpan potensi', message: msg });
		} finally {
			isSaving = false;
		}
	}

	function handleDeleteClick(id: number) {
		deleteTargetId = id;
		isDeleteDialogOpen = true;
	}

	async function confirmDelete() {
		if (deleteTargetId === null) return;
		isDeleting = true;
		try {
			await deletePotential({ id: deleteTargetId });
			await queryClient.invalidateQueries({ queryKey: ['potentials', 'list'] });
			toast.success('Potensi berhasil dihapus.');
			isDeleteDialogOpen = false;
			deleteTargetId = null;
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menghapus potensi', message: msg });
		} finally {
			isDeleting = false;
		}
	}
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-base font-bold text-slate-900">Pengelolaan Potensi & UMKM</h2>
			<p class="text-xs font-medium text-slate-500 mt-0.5">
				Kelola data potensi wisata, produk UMKM lokal, dan komoditas unggulan desa.
			</p>
		</div>
		<Button onclick={handleCreate} disabled={isPreparingForm || categoriesQuery.isPending}>
			{#if isPreparingForm || categoriesQuery.isPending}
				<Loader2 size={16} class="animate-spin" />
				Memuat Kategori...
			{:else}
				<Plus size={16} strokeWidth={2.5} />
				Tambah Potensi Baru
			{/if}
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
				placeholder="Cari potensi..."
				class="pl-9 bg-slate-50/50"
				bind:value={searchQuery}
			/>
		</div>
	</div>

	{#if isLoading}
		<div class="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-250">
			<div class="flex items-center gap-3 text-slate-500 font-semibold text-sm">
				<Loader2 size={20} class="animate-spin" />
				Memuat data potensi & UMKM...
			</div>
		</div>
	{:else}
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead class="w-16 text-center">No</TableHead>
					<TableHead class="w-24 text-center">Gambar</TableHead>
					<TableHead>Potensi / UMKM</TableHead>
					<TableHead>Slug & Subtitle</TableHead>
					<TableHead>Deskripsi</TableHead>
					<TableHead class="text-center">Kategori</TableHead>
					<TableHead class="text-right">Aksi</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if filteredPotentials.length === 0}
					<TableRow>
						<TableCell colspan={7} class="text-center py-8 text-slate-400 font-medium">
							Belum ada data potensi & UMKM.
						</TableCell>
					</TableRow>
				{:else}
					{#each filteredPotentials as item, index (item.id)}
						<TableRow>
							<TableCell class="text-center font-bold text-slate-400">{index + 1}</TableCell>
							<TableCell class="text-center">
								<MediaThumbnail media={item.media ?? item.media_id} alt={item.title} />
							</TableCell>
							<TableCell class="font-bold text-slate-900">{item.title}</TableCell>
							<TableCell class="max-w-xs text-xs">
								<span class="block font-semibold text-slate-550 truncate">{item.subtitle}</span>
								<code
									class="mt-1 block text-[10px] bg-slate-100 text-slate-650 px-1 py-0.5 rounded font-bold w-fit"
									>{item.slug}</code
								>
							</TableCell>
							<TableCell class="max-w-xs text-xs text-slate-500 line-clamp-1 py-5"
								>{item.description}</TableCell
							>
							<TableCell class="text-center">
								<span
									class="inline-flex h-6 px-2.5 items-center justify-center rounded bg-purple-50 text-xs font-bold text-purple-700"
								>
									{item.category.name || getCategoryName(item.category.id)}
								</span>
							</TableCell>
							<TableCell class="text-right whitespace-nowrap">
								<div class="flex items-center justify-end gap-2">
									<Button
										variant="outline"
										size="icon"
										onclick={() => handleEdit(item)}
										title="Ubah Potensi"
									>
										<Pencil size={14} />
									</Button>
									<Button
										variant="outline"
										size="icon"
										class="hover:bg-red-50 hover:text-red-650 hover:border-red-200"
										title="Hapus Potensi"
										onclick={() => handleDeleteClick(item.id)}
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
	title={editingItem ? 'Ubah Potensi / UMKM' : 'Tambah Potensi Baru'}
	subtitle={editingItem
		? `ID: ${editingItem.id} | Mengubah komoditas desa`
		: 'Tambah komoditas desa baru'}
>
	<form onsubmit={handleSave} class="flex flex-col p-6 space-y-4">
		<div class="grid gap-4 md:grid-cols-2">
			<div class="min-w-0 space-y-1.5">
				<label
					for="edit-title"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Potensi</label
				>
				<Input id="edit-title" bind:value={editForm.title} required />
			</div>
			<div class="min-w-0 space-y-1.5">
				<label for="edit-sub" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>Subtitle</label
				>
				<Input id="edit-sub" bind:value={editForm.subtitle} required />
			</div>
		</div>

		<div class="space-y-1.5">
			<label for="edit-slug" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
				>Slug</label
			>
			<Input id="edit-slug" bind:value={editForm.slug} required />
		</div>

		<div class="space-y-1.5">
			<label for="edit-desc" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
				>Deskripsi</label
			>
			<Textarea id="edit-desc" bind:value={editForm.description} rows={3} maxlength={255} required />
		</div>

		<div class="space-y-1.5">
			<div class="min-w-0 space-y-1.5">
				<label
					for="edit-category"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Kategori</label
				>
				<CategorySelect
					id="edit-category"
					bind:value={editForm.category_id}
					{categories}
					showType
					required
				/>
				{#if categoriesQuery.isError}
					<p class="text-[11px] font-semibold text-red-600">Gagal memuat kategori.</p>
				{:else if categories.length === 0}
					<p class="text-[11px] font-semibold text-slate-400">Belum ada kategori.</p>
				{/if}
			</div>
		</div>


		<div class="space-y-1.5">
			<span class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
				>Gambar Potensi</span
			>
			<ImageUploader
				bind:value={editForm.media_id}
				aspectRatio={4 / 3}
				placeholder="Pilih gambar potensi"
			/>
		</div>

		<div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
			<Button variant="outline" onclick={() => (isDialogOpen = false)} disabled={isSaving}
				>Batal</Button
			>
			<Button type="submit" disabled={isSaving}>
				{#if isSaving}
					<Loader2 size={16} class="animate-spin" />
					Menyimpan...
				{:else}
					Simpan Perubahan
				{/if}
			</Button>
		</div>
	</form>
</Dialog>

<ConfirmDialog
	bind:isOpen={isDeleteDialogOpen}
	title="Hapus Potensi/UMKM"
	description="Apakah Anda yakin ingin menghapus potensi/UMKM ini? Tindakan ini tidak dapat dibatalkan."
	isLoading={isDeleting}
	onConfirm={confirmDelete}
/>
