<script lang="ts">
	import {
		createGallery,
		deleteGallery,
		findGalleryById,
		listGalleries,
		updateGallery
	} from '../_request';
	import type { GalleryListItem } from '../_model/response';
	import { listCategories } from '../../category/_request';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import Button from '$lib/components/ui/Button.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import CategorySelect from '$lib/components/ui/CategorySelect.svelte';
	import MediaThumbnail from '$lib/components/ui/MediaThumbnail.svelte';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Loader2, Pencil, Plus, Search, Trash2 } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';

	const queryClient = useQueryClient();
	const galleriesQuery = createQuery(() => ({
		queryKey: ['galleries', 'list'],
		queryFn: () => listGalleries()
	}));
	const categoriesQuery = createQuery(() => ({
		queryKey: ['categories', 'list', 'gallery'],
		queryFn: () => listCategories()
	}));

	let items = $derived(galleriesQuery.data?.data || []);
	let categories = $derived(categoriesQuery.data?.data || []);
	let searchQuery = $state('');
	let isDialogOpen = $state(false);
	let editingItem = $state<GalleryListItem | null>(null);
	let form = $state({ title: '', description: '', category_id: 0, media_id: '' });
	let filteredItems = $derived(
		items.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);
	let isLoading = $derived(galleriesQuery.isPending || categoriesQuery.isPending);

	function openCreate() {
		editingItem = null;
		form = { title: '', description: '', category_id: categories[0]?.id || 0, media_id: '' };
		isDialogOpen = true;
	}

	async function openEdit(item: GalleryListItem) {
		editingItem = item;
		form = {
			title: item.title,
			description: '',
			category_id: categories[0]?.id || 0,
			media_id: ''
		};
		isDialogOpen = true;
		try {
			const detail = await findGalleryById({ id: item.id });
			form = {
				title: detail.data.title,
				description: detail.data.description,
				category_id: detail.data.category[0]?.id || categories[0]?.id || 0,
				media_id: ''
			};
		} catch (error) {
			console.error('Failed to load gallery detail:', error);
		}
	}

	async function save(event: Event) {
		event.preventDefault();
		const payload = {
			title: form.title,
			description: form.description,
			category_id: Number(form.category_id),
			media_id: form.media_id.trim() || null
		};
		try {
			if (editingItem) await updateGallery({ id: editingItem.id, ...payload });
			else await createGallery(payload);
			isDialogOpen = false;
			await queryClient.invalidateQueries({ queryKey: ['galleries', 'list'] });
			toast.success('Galeri berhasil disimpan!');
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menyimpan galeri', message: msg });
		}
	}

	async function remove(id: number) {
		if (!confirm('Apakah Anda yakin ingin menghapus galeri ini?')) return;
		try {
			await deleteGallery({ id });
			await queryClient.invalidateQueries({ queryKey: ['galleries', 'list'] });
			toast.success('Galeri berhasil dihapus.');
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menghapus galeri', message: msg });
		}
	}
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-base font-bold text-slate-900">Pengelolaan Galeri</h2>
			<p class="text-xs font-medium text-slate-500 mt-0.5">
				Kelola foto dan dokumentasi kegiatan desa.
			</p>
		</div>
		<Button onclick={openCreate}><Plus size={16} />Tambah Galeri</Button>
	</div>

	<div class="relative max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
		<span class="absolute inset-y-0 left-7 flex items-center text-slate-400"
			><Search size={16} /></span
		>
		<Input placeholder="Cari galeri..." class="pl-9" bind:value={searchQuery} />
	</div>

	{#if isLoading}
		<div
			class="flex items-center justify-center gap-3 rounded-xl border bg-white p-12 text-sm font-semibold text-slate-500"
		>
			<Loader2 size={20} class="animate-spin" />Memuat galeri...
		</div>
	{:else}
		<Table>
			<TableHeader
				><TableRow
					><TableHead>No</TableHead><TableHead>Judul</TableHead><TableHead class="w-24 text-center"
						>Gambar</TableHead
					><TableHead class="text-right">Aksi</TableHead></TableRow
				></TableHeader
			>
			<TableBody>
				{#each filteredItems as item, index (item.id)}
					<TableRow>
						<TableCell>{index + 1}</TableCell>
						<TableCell class="font-bold">{item.title}</TableCell>
						<TableCell class="text-center">
							<MediaThumbnail media={item.image} alt={item.title} />
						</TableCell>
						<TableCell class="text-right">
							<Button variant="outline" size="icon" onclick={() => openEdit(item)}
								><Pencil size={14} /></Button
							>
							<Button variant="outline" size="icon" onclick={() => remove(item.id)}
								><Trash2 size={14} /></Button
							>
						</TableCell>
					</TableRow>
				{:else}
					<TableRow
						><TableCell colspan={4} class="py-8 text-center text-slate-400"
							>Belum ada data galeri.</TableCell
						></TableRow
					>
				{/each}
			</TableBody>
		</Table>
	{/if}
</div>

<Dialog bind:isOpen={isDialogOpen} title={editingItem ? 'Ubah Galeri' : 'Tambah Galeri'}>
	<form onsubmit={save} class="space-y-4 p-6">
		<Input bind:value={form.title} placeholder="Judul" required />
		<Textarea bind:value={form.description} placeholder="Deskripsi" required />
		<CategorySelect bind:value={form.category_id} {categories} required />
		<ImageUploader
			bind:value={form.media_id}
			aspectRatio={4 / 3}
			placeholder="Pilih gambar galeri"
		/>
		<div class="flex justify-end gap-3 border-t pt-4">
			<Button variant="outline" onclick={() => (isDialogOpen = false)}>Batal</Button>
			<Button type="submit">Simpan</Button>
		</div>
	</form>
</Dialog>
