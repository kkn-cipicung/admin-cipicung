<script lang="ts">
	import type { DashboardData } from '../_model/response';
	import { listDashboards, createDashboard, updateDashboard, deleteDashboard } from '../_request';
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
	const dashboardsQuery = createQuery(() => ({
		queryKey: ['dashboards', 'list'],
		queryFn: () => listDashboards()
	}));

	let dashboardItems = $derived(dashboardsQuery.data?.data || []);
	let isLoading = $derived(dashboardsQuery.isPending);

	let isDialogOpen = $state(false);
	let editingItem = $state<DashboardData | null>(null);
	let editForm = $state({
		title: '',
		description: '',
		category_id: 1,
		created_by: 101
	});

	function handleCreate() {
		editingItem = null;
		editForm = {
			title: '',
			description: '',
			category_id: 1,
			created_by: 101
		};
		isDialogOpen = true;
	}

	function handleEdit(item: DashboardData) {
		editingItem = item;
		editForm = {
			title: item.title,
			description: item.description,
			category_id: item.category_id,
			created_by: item.created_by
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
					description: editForm.description
				});
			} else {
				await createDashboard({
					category_id: Number(editForm.category_id),
					title: editForm.title,
					description: editForm.description
				});
			}
			isDialogOpen = false;
			editingItem = null;
			await queryClient.invalidateQueries({ queryKey: ['dashboards', 'list'] });
		} catch (error) {
			console.error('Failed to save dashboard item:', error);
		}
	}

	async function handleDelete(id: number) {
		if (confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
			try {
				await deleteDashboard({ id });
				await queryClient.invalidateQueries({ queryKey: ['dashboards', 'list'] });
			} catch (error) {
				console.error('Failed to delete dashboard item:', error);
			}
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
			<Input placeholder="Cari konten dashboard..." class="pl-9 bg-slate-50/50" />
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
					<TableHead>Judul Konten</TableHead>
					<TableHead>Deskripsi Slide</TableHead>
					<TableHead class="text-center">Cat. ID</TableHead>
					<TableHead class="text-center">Editor ID</TableHead>
					<TableHead>Tanggal Dibuat</TableHead>
					<TableHead class="text-right">Aksi</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if dashboardItems.length === 0}
					<TableRow>
						<TableCell colspan={7} class="text-center py-8 text-slate-400 font-medium">
							Belum ada data slide dashboard.
						</TableCell>
					</TableRow>
				{:else}
					{#each dashboardItems as item, index (item.id)}
						<TableRow>
							<TableCell class="text-center font-bold text-slate-400">{index + 1}</TableCell>
							<TableCell class="font-bold text-slate-900">{item.title}</TableCell>
							<TableCell class="max-w-sm text-xs text-slate-500 line-clamp-1 py-5"
								>{item.description}</TableCell
							>
							<TableCell class="text-center">
								<span
									class="inline-flex h-6 w-8 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-600"
								>
									{item.category_id}
								</span>
							</TableCell>
							<TableCell class="text-center">
								<span
									class="inline-flex h-6 w-10 items-center justify-center rounded bg-blue-50 text-xs font-bold text-blue-700"
								>
									#{item.created_by}
								</span>
							</TableCell>
							<TableCell class="text-xs text-slate-500 whitespace-nowrap"
								>{formatDate(item.created_at)}</TableCell
							>
							<TableCell class="text-right">
								<div class="flex items-center justify-end gap-2">
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
				<label for="edit-cat" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>Category ID</label
				>
				<Input type="number" id="edit-cat" bind:value={editForm.category_id} required />
			</div>
			{#if !editingItem}
				<div class="space-y-1.5">
					<label
						for="edit-by"
						class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Editor ID</label
					>
					<Input type="number" id="edit-by" bind:value={editForm.created_by} required />
				</div>
			{/if}
		</div>

		<div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
			<Button variant="outline" onclick={() => (isDialogOpen = false)}>Batal</Button>
			<Button type="submit">Simpan Perubahan</Button>
		</div>
	</form>
</Dialog>
