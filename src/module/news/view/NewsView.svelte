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
	import { Plus, Search, Loader2, Pencil, Trash2 } from '@lucide/svelte';

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
	let editForm = $state({
		title: '',
		description: '',
		category_id: 0,
		uploaded_by: 101
	});

	let filteredArticles = $derived(
		articles.filter((article) => {
			const matchesCategory = selectedCategoryId
				? article.category_id === Number(selectedCategoryId)
				: true;
			const matchesSearch = searchQuery
				? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					article.description.toLowerCase().includes(searchQuery.toLowerCase())
				: true;
			return matchesCategory && matchesSearch;
		})
	);

	let isLoading = $derived(articlesQuery.isPending || categoriesQuery.isPending);

	const handleCreate = () => {
		editingItem = null;
		editForm = {
			title: '',
			description: '',
			category_id: categories.length > 0 ? categories[0].id : 0,
			uploaded_by: 101
		};
		isDialogOpen = true;
	};

	const handleEdit = (item: NewsData) => {
		editingItem = item;
		editForm = {
			title: item.title,
			description: item.description,
			category_id: item.category_id,
			uploaded_by: item.uploaded_by
		};
		isDialogOpen = true;
	};

	const handleSave = async (e: Event) => {
		e.preventDefault();
		try {
			if (editingItem) {
				await updateNews({
					id: editingItem.id,
					title: editForm.title,
					description: editForm.description,
					category_id: Number(editForm.category_id)
				});
			} else {
				await createNews({
					title: editForm.title,
					description: editForm.description,
					category_id: Number(editForm.category_id),
					uploaded_by: Number(editForm.uploaded_by)
				});
			}
			isDialogOpen = false;
			editingItem = null;
			await queryClient.invalidateQueries({ queryKey: ['news', 'list'] });
		} catch (error) {
			console.error('Failed to save article:', error);
		}
	};

	const handleDelete = async (id: number) => {
		if (confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
			try {
				await deleteNews({ id });
				await queryClient.invalidateQueries({ queryKey: ['news', 'list'] });
			} catch (error) {
				console.error('Failed to delete article:', error);
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
		<Button onclick={handleCreate}>
			<Plus size={16} strokeWidth={2.5} />
			Tulis Konten Baru
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
			<select
				bind:value={selectedCategoryId}
				class="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
			>
				<option value="">Semua Kategori</option>
				{#each categories as category (category.id)}
					<option value={category.id}>{category.name}</option>
				{/each}
			</select>
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
					<TableHead>Judul Konten</TableHead>
					<TableHead>Ringkasan Deskripsi</TableHead>
					<TableHead class="text-center">Kategori</TableHead>
					<TableHead class="text-center">Editor ID</TableHead>
					<TableHead>Tanggal Unggah</TableHead>
					<TableHead class="text-right">Aksi</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if filteredArticles.length === 0}
					<TableRow>
						<TableCell colspan={7} class="text-center py-8 text-slate-400 font-medium">
							Belum ada data berita.
						</TableCell>
					</TableRow>
				{:else}
					{#each filteredArticles as article, index (article.id)}
						<TableRow>
							<TableCell class="text-center font-bold text-slate-400">{index + 1}</TableCell>
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
									{getCategoryName(article.category_id)}
								</span>
							</TableCell>
							<TableCell class="text-center">
								<span
									class="inline-flex h-6 w-10 items-center justify-center rounded bg-blue-50 text-xs font-bold text-blue-700"
								>
									#{article.uploaded_by}
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
				<select
					id="edit-cat"
					bind:value={editForm.category_id}
					required
					class="w-full rounded-xl border border-slate-250 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
				>
					<option value={0} disabled>Pilih Kategori</option>
					{#each categories as category (category.id)}
						<option value={category.id}>{category.name}</option>
					{/each}
				</select>
			</div>
			{#if !editingItem}
				<div class="space-y-1.5">
					<label
						for="edit-by"
						class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Editor ID</label
					>
					<Input type="number" id="edit-by" bind:value={editForm.uploaded_by} required />
				</div>
			{/if}
		</div>

		<div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
			<Button variant="outline" onclick={() => (isDialogOpen = false)}>Batal</Button>
			<Button type="submit">Simpan Perubahan</Button>
		</div>
	</form>
</Dialog>
