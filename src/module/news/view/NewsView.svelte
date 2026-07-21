<script lang="ts">
	import type { NewsData } from '../_model/response';
	import { listNews, createNews, updateNews, deleteNews } from '../_request';
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
	import { Plus, Search, Loader2, Pencil, Trash2 } from '@lucide/svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import MediaThumbnail from '$lib/components/ui/MediaThumbnail.svelte';
	import { toast } from '$lib/stores/toast.svelte';

	const queryClient = useQueryClient();
	const articlesQuery = createQuery(() => ({
		queryKey: ['news', 'list'],
		queryFn: () => listNews()
	}));
	const categoriesQuery = createQuery(() => ({
		queryKey: ['categories', 'list'],
		queryFn: () => listCategories()
	}));

	let articles = $derived(articlesQuery.data?.data || []);
	let categories = $derived((categoriesQuery.data?.data || []).filter((c) => c.type === 'news'));

	let selectedCategoryId = $state<number | string>('');
	let searchQuery = $state('');

	let isDialogOpen = $state(false);
	let editingItem = $state<NewsData | null>(null);
	let isPreparingForm = $state(false);
	let editForm = $state({
		title: '',
		description: '',
		category_id: 0,
		media_id: ''
	});

	let filteredArticles = $derived(
		articles.filter((article) => {
			const matchesCategory = selectedCategoryId
				? article.category.id === Number(selectedCategoryId)
				: true;
			const matchesSearch = searchQuery
				? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					article.description.toLowerCase().includes(searchQuery.toLowerCase())
				: true;
			return matchesCategory && matchesSearch;
		})
	);

	let isLoading = $derived(articlesQuery.isPending || categoriesQuery.isPending);

	const getNewsCategories = (items = categoriesQuery.data?.data || []) => {
		return items.filter((category) => category.type === 'news');
	};

	const getDefaultCategoryId = (items = categories) => {
		return items.length > 0 ? items[0].id : 0;
	};

	const handleCreate = async () => {
		isPreparingForm = true;
		try {
			const categoryResult = categories.length > 0 ? null : await categoriesQuery.refetch();
			const latestCategories = getNewsCategories(categoryResult?.data?.data || categories);

			editingItem = null;
			editForm = {
				title: '',
				description: '',
				category_id: getDefaultCategoryId(latestCategories),
				media_id: ''
			};
			isDialogOpen = true;
		} finally {
			isPreparingForm = false;
		}
	};

	const handleEdit = (item: NewsData) => {
		editingItem = item;
		editForm = {
			title: item.title,
			description: item.description,
			category_id: item.category.id,
			media_id: ''
		};
		isDialogOpen = true;
	};

	const handleSave = async (e: Event) => {
		e.preventDefault();
		const categoryId = Number(editForm.category_id);

		if (!categoryId) {
			toast.error({
				title: 'Kategori belum dipilih',
				message: 'Pilih kategori berita terlebih dahulu sebelum menyimpan.'
			});
			return;
		}

		try {
			if (editingItem) {
				await updateNews({
					id: editingItem.id,
					title: editForm.title,
					description: editForm.description,
					category_id: categoryId,
					media_id: editForm.media_id.trim() || null
				});
			} else {
				await createNews({
					title: editForm.title,
					description: editForm.description,
					category_id: categoryId,
					media_id: editForm.media_id.trim() || null
				});
			}
			isDialogOpen = false;
			editingItem = null;
			await queryClient.invalidateQueries({ queryKey: ['news', 'list'] });
			toast.success('Berita berhasil disimpan!');
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menyimpan berita', message: msg });
		}
	};

	const handleDelete = async (id: number) => {
		if (confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
			try {
				await deleteNews({ id });
				await queryClient.invalidateQueries({ queryKey: ['news', 'list'] });
				toast.success('Berita berhasil dihapus.');
			} catch (error) {
				const err = error as { apiResponse?: { message?: string }; message?: string };
				const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
				toast.error({ title: 'Gagal menghapus berita', message: msg });
			}
		}
	};

	const getCategoryName = (catId: number) => {
		const cat = categories.find((c) => c.id === catId);
		return cat ? cat.name : `#${catId}`;
	};

	const formatDate = (isoString: string) => {
		return new Date(isoString).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	};
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-base font-bold text-slate-900">Pengelolaan Berita & Konten</h2>
			<p class="text-xs font-medium text-slate-500 mt-0.5">
				Kelola, publikasi, dan sunting konten tulisan informasi Desa Cipicung.
			</p>
		</div>
		<Button onclick={handleCreate} disabled={isPreparingForm || categoriesQuery.isPending}>
			{#if isPreparingForm || categoriesQuery.isPending}
				<Loader2 size={16} class="animate-spin" />
				Memuat Kategori...
			{:else}
				<Plus size={16} strokeWidth={2.5} />
				Tulis Konten Baru
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
				placeholder="Cari konten berdasarkan judul atau kata kunci..."
				class="pl-9 bg-slate-50/50"
				bind:value={searchQuery}
			/>
		</div>

		<div class="flex items-center gap-3">
			<CategorySelect
				bind:value={selectedCategoryId}
				{categories}
				allLabel="Semua Kategori"
				class="bg-slate-50/50"
			/>
		</div>
	</div>

	{#if isLoading}
		<div class="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-250">
			<div class="flex items-center gap-3 text-slate-500 font-semibold text-sm">
				<Loader2 size={20} class="animate-spin" />
				Memuat data berita...
			</div>
		</div>
	{:else}
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead class="w-16 text-center">No</TableHead>
					<TableHead class="w-24 text-center">Gambar</TableHead>
					<TableHead>Judul Konten</TableHead>
					<TableHead>Ringkasan Deskripsi</TableHead>
					<TableHead class="text-center">Kategori</TableHead>
					<TableHead class="text-center">Editor</TableHead>
					<TableHead>Tanggal Unggah</TableHead>
					<TableHead class="text-right">Aksi</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if filteredArticles.length === 0}
					<TableRow>
						<TableCell colspan={8} class="text-center py-8 text-slate-400 font-medium">
							Belum ada data berita.
						</TableCell>
					</TableRow>
				{:else}
					{#each filteredArticles as article, index (article.id)}
						<TableRow>
							<TableCell class="text-center font-bold text-slate-400">{index + 1}</TableCell>
							<TableCell class="text-center">
								<MediaThumbnail media={article.media_id} alt={article.title} />
							</TableCell>
							<TableCell class="font-bold text-slate-900 max-w-xs truncate"
								>{article.title}</TableCell
							>
							<TableCell class="max-w-sm text-xs text-slate-500 line-clamp-1 py-5"
								>{article.description}</TableCell
							>
							<TableCell class="text-center">
								<span
									class="inline-flex h-6 px-2.5 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-650"
								>
									{article.category.name || getCategoryName(article.category.id)}
								</span>
							</TableCell>
							<TableCell class="text-center">
								<span
									class="inline-flex h-6 px-2.5 items-center justify-center rounded bg-blue-50 text-xs font-bold text-blue-700"
								>
									{article.uploader.name || '#' + article.uploader.id}
								</span>
							</TableCell>
							<TableCell class="text-xs text-slate-500 whitespace-nowrap"
								>{formatDate(article.created_at)}</TableCell
							>
							<TableCell class="text-right">
								<div class="flex items-center justify-end gap-2">
									<Button
										variant="outline"
										size="icon"
										onclick={() => handleEdit(article)}
										title="Edit Konten"
									>
										<Pencil size={14} />
									</Button>
									<Button
										variant="outline"
										size="icon"
										class="hover:bg-red-50 hover:text-red-650 hover:border-red-200"
										title="Hapus Konten"
										onclick={() => handleDelete(article.id)}
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
	title={editingItem ? 'Ubah Konten Berita' : 'Tulis Konten Baru'}
	subtitle={editingItem
		? `ID: ${editingItem.id} | Mengedit artikel berita`
		: 'Buat artikel berita baru'}
>
	<form onsubmit={handleSave} class="flex flex-col p-6 space-y-4">
		<div class="space-y-1.5">
			<label for="edit-title" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
				>Judul Konten</label
			>
			<Input id="edit-title" bind:value={editForm.title} required />
		</div>

		<div class="space-y-1.5">
			<label for="edit-desc" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
				>Ringkasan Deskripsi</label
			>
			<Textarea id="edit-desc" bind:value={editForm.description} rows={4} required />
		</div>

		<div class="grid gap-4 {editingItem ? 'grid-cols-1' : 'grid-cols-2'}">
			<div class="space-y-1.5">
				<label for="edit-cat" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>Kategori</label
				>
				<CategorySelect id="edit-cat" bind:value={editForm.category_id} {categories} required />
				{#if categoriesQuery.isError}
					<p class="text-[11px] font-semibold text-red-600">Gagal memuat kategori.</p>
				{:else if categories.length === 0}
					<p class="text-[11px] font-semibold text-slate-400">Belum ada kategori berita.</p>
				{/if}
			</div>
		</div>

		<div>
			<ImageUploader
				bind:value={editForm.media_id}
				aspectRatio={16 / 9}
				placeholder="Pilih gambar berita"
			/>
		</div>

		<div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
			<Button variant="outline" onclick={() => (isDialogOpen = false)}>Batal</Button>
			<Button type="submit">Simpan Perubahan</Button>
		</div>
	</form>
</Dialog>
