<script lang="ts">
	import type { DashboardData } from '../_model/response';
	import {
		listDashboards,
		createDashboard,
		updateDashboard,
		deleteDashboard,
		activateDashboard
	} from '../_request';
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
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import CategorySelect from '$lib/components/ui/CategorySelect.svelte';
	import MediaThumbnail from '$lib/components/ui/MediaThumbnail.svelte';
	import { Plus, Search, Loader2, Pencil, Trash2, CircleCheck, CircleX } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';

	const queryClient = useQueryClient();
	const dashboardsQuery = createQuery(() => ({
		queryKey: ['dashboards', 'list'],
		queryFn: () => listDashboards()
	}));
	const categoriesQuery = createQuery(() => ({
		queryKey: ['categories', 'list', 'dashboard'],
		queryFn: () => listCategories()
	}));

	let dashboardItems = $derived(dashboardsQuery.data?.data || []);
	let categories = $derived(
		(categoriesQuery.data?.data || []).filter((category) => category.type === 'dashboard')
	);
	let isLoading = $derived(dashboardsQuery.isPending || categoriesQuery.isPending);

	let isDialogOpen = $state(false);
	let editingItem = $state<DashboardData | null>(null);
	let activatingId = $state<number | null>(null);
	let searchQuery = $state('');
	let editForm = $state({
		title: '',
		description: '',
		category_id: 1,
		media_id: ''
	});
	let filteredDashboardItems = $derived(
		dashboardItems.filter((item) => {
			const query = searchQuery.toLowerCase();
			return searchQuery
				? item.title.toLowerCase().includes(query) ||
						item.description.toLowerCase().includes(query) ||
						item.category.name.toLowerCase().includes(query)
				: true;
		})
	);

	function handleCreate() {
		editingItem = null;
		editForm = {
			title: '',
			description: '',
			category_id: categories.length > 0 ? categories[0].id : 1,
			media_id: ''
		};
		isDialogOpen = true;
	}

	function getCategoryName(categoryId: number) {
		const category = categories.find((item) => item.id === categoryId);
		return category ? `${category.name} (${category.type})` : `#${categoryId}`;
	}

	function handleEdit(item: DashboardData) {
		editingItem = item;
		editForm = {
			title: item.title,
			description: item.description,
			category_id: item.category.id,
			media_id: ''
		};
		isDialogOpen = true;
	}

	async function handleSave(e: Event) {
		e.preventDefault();
		try {
			if (editingItem) {
				await updateDashboard({
					id: editingItem.id,
					category_id: Number(editForm.category_id),
					title: editForm.title,
					description: editForm.description,
					media_id: editForm.media_id.trim() || null,
					is_active: editingItem.is_active
				});
			} else {
				await createDashboard({
					category_id: Number(editForm.category_id),
					title: editForm.title,
					description: editForm.description,
					media_id: editForm.media_id.trim() || null
				});
			}
			isDialogOpen = false;
			editingItem = null;
			await queryClient.invalidateQueries({ queryKey: ['dashboards', 'list'] });
			toast.success('Konten dashboard berhasil disimpan!');
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal menyimpan dashboard', message: msg });
		}
	}

	async function handleDelete(id: number) {
		if (confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
			try {
				await deleteDashboard({ id });
				await queryClient.invalidateQueries({ queryKey: ['dashboards', 'list'] });
				toast.success('Konten dashboard berhasil dihapus.');
			} catch (error) {
				const err = error as { apiResponse?: { message?: string }; message?: string };
				const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
				toast.error({ title: 'Gagal menghapus dashboard', message: msg });
			}
		}
	}

	async function handleActivate(id: number) {
		if (activatingId !== null) return;

		activatingId = id;
		try {
			await activateDashboard({ id });
			await queryClient.invalidateQueries({ queryKey: ['dashboards', 'list'] });
			toast.success('Konten berhasil diaktifkan!');
		} catch (error) {
			const err = error as { apiResponse?: { message?: string }; message?: string };
			const msg = err.apiResponse?.message || err.message || 'Terjadi kesalahan.';
			toast.error({ title: 'Gagal mengaktifkan konten', message: msg });
		} finally {
			activatingId = null;
		}
	}

	function formatDate(isoString: string) {
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
			<h2 class="text-base font-bold text-slate-900">Pengaturan Slide & Informasi Client</h2>
			<p class="text-xs font-medium text-slate-550 mt-0.5">
				Kelola data headline, slide gambar, dan sambutan yang tampil di halaman dashboard utama
				aplikasi client.
			</p>
		</div>
		<Button onclick={handleCreate}>
			<Plus size={16} strokeWidth={2.5} />
			Tambah Konten Slide
		</Button>
	</div>

	<div class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
		<div class="relative flex-1 max-w-sm">
			<span class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
				<Search size={16} />
			</span>
			<Input
				placeholder="Cari konten dashboard..."
				class="pl-9 bg-slate-50/50"
				bind:value={searchQuery}
			/>
		</div>
	</div>

	{#if isLoading}
		<div class="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-250">
			<div class="flex items-center gap-3 text-slate-500 font-semibold text-sm">
				<Loader2 size={20} class="animate-spin" />
				Memuat data slide...
			</div>
		</div>
	{:else}
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead class="w-16 text-center">No</TableHead>
					<TableHead class="w-24 text-center">Gambar</TableHead>
					<TableHead>Judul Konten</TableHead>
					<TableHead>Deskripsi Slide</TableHead>
					<TableHead class="text-center">Kategori</TableHead>
					<TableHead class="text-center">Editor</TableHead>
					<TableHead>Tanggal Dibuat</TableHead>
					<TableHead class="text-right">Aksi</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if filteredDashboardItems.length === 0}
					<TableRow>
						<TableCell colspan={8} class="text-center py-8 text-slate-400 font-medium">
							Belum ada data slide dashboard.
						</TableCell>
					</TableRow>
				{:else}
					{#each filteredDashboardItems as item, index (item.id)}
						<TableRow>
							<TableCell class="text-center font-bold text-slate-400">{index + 1}</TableCell>
							<TableCell class="text-center">
								<MediaThumbnail media={item.media_id} alt={item.title} />
							</TableCell>
							<TableCell class="font-bold text-slate-900">{item.title}</TableCell>
							<TableCell class="max-w-sm text-xs text-slate-500 line-clamp-1 py-5"
								>{item.description}</TableCell
							>
							<TableCell class="text-center">
								<span
									class="inline-flex h-6 px-2.5 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-650"
								>
									{item.category.name || getCategoryName(item.category.id)}
								</span>
							</TableCell>
							<TableCell class="text-center">
								<span
									class="inline-flex h-6 px-2.5 items-center justify-center rounded bg-blue-50 text-xs font-bold text-blue-700"
								>
									{item.creator.name || '#' + item.creator.id}
								</span>
							</TableCell>
							<TableCell class="text-xs text-slate-500 whitespace-nowrap"
								>{formatDate(item.created_at)}</TableCell
							>
							<TableCell class="text-right">
								<div class="flex items-center justify-end gap-2">
									<Button
										size="sm"
										class={item.is_active
											? 'bg-emerald-600 text-white hover:bg-emerald-600 shadow-none'
											: 'bg-red-600 text-white hover:bg-red-700 shadow-none'}
										title={item.is_active
											? 'Konten sedang aktif'
											: 'Klik untuk mengaktifkan konten'}
										aria-disabled={item.is_active}
										disabled={activatingId !== null}
										onclick={() => !item.is_active && handleActivate(item.id)}
									>
										{#if activatingId === item.id}
											<Loader2 size={14} class="animate-spin" />
											Mengaktifkan...
										{:else if item.is_active}
											<CircleCheck size={14} />
											Aktif
										{:else}
											<CircleX size={14} />
											Nonaktif
										{/if}
									</Button>
									<Button
										variant="outline"
										size="icon"
										onclick={() => handleEdit(item)}
										title="Ubah Konten"
									>
										<Pencil size={14} />
									</Button>
									<Button
										variant="outline"
										size="icon"
										class="hover:bg-red-50 hover:text-red-650 hover:border-red-200"
										title="Hapus Konten"
										onclick={() => handleDelete(item.id)}
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
	title={editingItem ? 'Ubah Konten Dashboard' : 'Tambah Konten Slide'}
	subtitle={editingItem
		? `ID: ${editingItem.id} | Mengubah konten slide client`
		: 'Tambah slide baru'}
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
				>Deskripsi Slide</label
			>
			<Textarea id="edit-desc" bind:value={editForm.description} rows={4} required />
		</div>

		<div class="grid grid-cols-2 gap-4">
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
		</div>

		<div class="space-y-1.5">
			<label class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
				>Gambar Slide</label
			>
			<ImageUploader
				bind:value={editForm.media_id}
				aspectRatio={16 / 9}
				placeholder="Pilih gambar slide dashboard"
			/>
		</div>

		<div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
			<Button variant="outline" onclick={() => (isDialogOpen = false)}>Batal</Button>
			<Button type="submit">Simpan Perubahan</Button>
		</div>
	</form>
</Dialog>
