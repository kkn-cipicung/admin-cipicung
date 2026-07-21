<script lang="ts">
	import type { CategoryData } from '../_model/response';
	import type { CategoryType } from '../_model/payload';
	import { listCategories, createCategory, updateCategory, deleteCategory } from '../_request';
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
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { Plus, Search, Loader2, Pencil, Trash2 } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';

	const queryClient = useQueryClient();
	const categoriesQuery = createQuery(() => ({
		queryKey: ['categories', 'list'],
		queryFn: () => listCategories()
	}));

	let categories = $derived(categoriesQuery.data?.data || []);
	let isLoading = $derived(categoriesQuery.isPending);

	let isDialogOpen = $state(false);
	let editingItem = $state<CategoryData | null>(null);
	let searchQuery = $state('');
	let editForm = $state({
		name: '',
		type: 'news' as CategoryType
	});
	let filteredCategories = $derived(
		categories.filter((category) => {
			const query = searchQuery.toLowerCase();
			return searchQuery
				? category.name.toLowerCase().includes(query) ||
						category.type.toLowerCase().includes(query) ||
						category.slug.toLowerCase().includes(query)
				: true;
		})
	);

	const handleCreate = () => {
		editingItem = null;
		editForm = {
			name: '',
			type: 'news'
		};
		isDialogOpen = true;
	};

	const handleEdit = (item: CategoryData) => {
		editingItem = item;
		editForm = {
			name: item.name,
			type: item.type
		};
		isDialogOpen = true;
	};

	const handleSave = async (e: Event) => {
		e.preventDefault();
		try {
			if (editingItem) {
				await updateCategory({
					id: editingItem.id,
					name: editForm.name,
					type: editForm.type
				});
			} else {
				await createCategory({
					name: editForm.name,
					type: editForm.type
				});
			}
			isDialogOpen = false;
			editingItem = null;
			await queryClient.invalidateQueries({ queryKey: ['categories', 'list'] });
			toast.success('Kategori berhasil disimpan!');
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menyimpan kategori', message: msg });
		}
	};

	const handleDelete = async (id: number) => {
		if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
			try {
				await deleteCategory({ id });
				await queryClient.invalidateQueries({ queryKey: ['categories', 'list'] });
				toast.success('Kategori berhasil dihapus.');
			} catch (error) {
				const err = error as { apiResponse?: { message?: string }; message?: string };
				const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
				toast.error({ title: 'Gagal menghapus kategori', message: msg });
			}
		}
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
			<h2 class="text-base font-bold text-slate-900">Daftar Kategori</h2>
			<p class="text-xs font-medium text-slate-500 mt-0.5">
				Kelola kategori untuk mengklasifikasikan berita, potensi, dan bisnis desa.
			</p>
		</div>
		<Button onclick={handleCreate}>
			<Plus size={16} strokeWidth={2.5} />
			Tambah Kategori
		</Button>
	</div>

	<div class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
		<div class="relative flex-1 max-w-sm">
			<span class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
				<Search size={16} />
			</span>
			<Input placeholder="Cari kategori..." class="pl-9 bg-slate-50/50" bind:value={searchQuery} />
		</div>
	</div>

	{#if isLoading}
		<div class="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-250">
			<div class="flex items-center gap-3 text-slate-500 font-semibold text-sm">
				<Loader2 size={20} class="animate-spin" />
				Memuat data kategori...
			</div>
		</div>
	{:else}
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead class="w-16 text-center">No</TableHead>
					<TableHead>Nama Kategori</TableHead>
					<TableHead>Tipe Modul</TableHead>
					<TableHead>Tanggal Dibuat</TableHead>
					<TableHead class="text-right">Aksi</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if filteredCategories.length === 0}
					<TableRow>
						<TableCell colspan={5} class="text-center py-8 text-slate-400 font-medium">
							Belum ada data kategori.
						</TableCell>
					</TableRow>
				{:else}
					{#each filteredCategories as category, index (category.id)}
						<TableRow>
							<TableCell class="text-center font-bold text-slate-400">{index + 1}</TableCell>
							<TableCell class="font-bold text-slate-900">{category.name}</TableCell>
							<TableCell>
								<span
									class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ring-1 ring-inset
									{category.type === 'news' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' : ''}
									{category.type === 'dashboard' ? 'bg-emerald-50 text-emerald-700 ring-emerald-700/10' : ''}
									{category.type === 'gallery' ? 'bg-rose-50 text-rose-700 ring-rose-700/10' : ''}
									{category.type === 'business' ? 'bg-amber-50 text-amber-700 ring-amber-700/10' : ''}
									{category.type === 'potential' ? 'bg-purple-50 text-purple-700 ring-purple-700/10' : ''}
								"
								>
									{category.type}
								</span>
							</TableCell>
							<TableCell class="text-xs text-slate-500 whitespace-nowrap"
								>{formatDate(category.created_at)}</TableCell
							>
							<TableCell class="text-right">
								<div class="flex items-center justify-end gap-2">
									<Button
										variant="outline"
										size="icon"
										onclick={() => handleEdit(category)}
										title="Ubah Kategori"
									>
										<Pencil size={14} />
									</Button>
									<Button
										variant="outline"
										size="icon"
										class="hover:bg-red-50 hover:text-red-650 hover:border-red-200"
										title="Hapus Kategori"
										onclick={() => handleDelete(category.id)}
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
	title={editingItem ? 'Ubah Kategori' : 'Tambah Kategori'}
	subtitle={editingItem
		? `ID: ${editingItem.id} | Mengubah kategori konten`
		: 'Tambah kategori baru'}
>
	<form onsubmit={handleSave} class="flex flex-col p-6 space-y-4">
		<div class="space-y-1.5">
			<label for="edit-name" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
				>Nama Kategori</label
			>
			<Input id="edit-name" bind:value={editForm.name} required />
		</div>

		<div class="space-y-1.5">
			<label for="edit-type" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
				>Tipe Modul</label
			>
			<select
				id="edit-type"
				bind:value={editForm.type}
				required
				class="w-full rounded-xl border border-slate-250 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
			>
				<option value="news">news (Berita)</option>
				<option value="dashboard">dashboard (Dashboard)</option>
				<option value="gallery">gallery (Galeri)</option>
				<option value="business">business (Bisnis/UMKM)</option>
				<option value="potential">potential (Potensi Desa)</option>
			</select>
		</div>

		<div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
			<Button variant="outline" onclick={() => (isDialogOpen = false)}>Batal</Button>
			<Button type="submit">Simpan Perubahan</Button>
		</div>
	</form>
</Dialog>
