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
	import { Plus, Search, Loader2, Pencil, Trash2 } from '@lucide/svelte';

	const queryClient = useQueryClient();
	const potentialsQuery = createQuery(() => ({
		queryKey: ['potentials', 'list'],
		queryFn: () => listPotentials()
	}));
	const categoriesQuery = createQuery(() => ({
		queryKey: ['categories', 'list', 'potential'],
		queryFn: () => listCategories({ type: 'potential' })
	}));

	let potentials = $derived(potentialsQuery.data?.data || []);
	let categories = $derived(
		(categoriesQuery.data?.data || []).filter((category) => category.type === 'potential')
	);
	let isLoading = $derived(potentialsQuery.isPending || categoriesQuery.isPending);

	let isDialogOpen = $state(false);
	let editingItem = $state<PotentialData | null>(null);
	let editForm = $state({
		title: '',
		subtitle: '',
		slug: '',
		description: '',
		category_id: 1,
		location_id: 1,
		media_id: 1,
		owner_name: '',
		owner_msisdn: '',
		uploaded_by: 101
	});

	function handleCreate() {
		editingItem = null;
		editForm = {
			title: '',
			subtitle: '',
			slug: '',
			description: '',
			category_id: getDefaultCategoryId(),
			location_id: 1,
			media_id: 1,
			owner_name: '',
			owner_msisdn: '',
			uploaded_by: 101
		};
		isDialogOpen = true;
	}

	function getCategoryName(categoryId: number) {
		const category = categories.find((item) => item.id === categoryId);
		return category ? category.name : `#${categoryId}`;
	}

	function getDefaultCategoryId() {
		return categories.length > 0 ? categories[0].id : 1;
	}

	function handleEdit(item: PotentialData) {
		editingItem = item;
		editForm = {
			title: item.title,
			subtitle: item.subtitle,
			slug: item.slug,
			description: item.description,
			category_id: item.category_id,
			location_id: item.location_id,
			media_id: item.media_id,
			owner_name: item.owner_name,
			owner_msisdn: item.owner_msisdn,
			uploaded_by: 101
		};
		isDialogOpen = true;
	}

	async function handleSave(e: Event) {
		e.preventDefault();
		try {
			if (editingItem) {
				await updatePotential({
					id: editingItem.id,
					category_id: Number(editForm.category_id),
					title: editForm.title,
					subtitle: editForm.subtitle,
					slug: editForm.slug,
					description: editForm.description,
					latitude: 0,
					longitude: 0,
					owner_name: editForm.owner_name,
					owner_msisdn: editForm.owner_msisdn
				});
			} else {
				await createPotential({
					uploaded_by: Number(editForm.uploaded_by),
					category_id: Number(editForm.category_id),
					title: editForm.title,
					subtitle: editForm.subtitle,
					slug: editForm.slug,
					description: editForm.description,
					latitude: 0,
					longitude: 0,
					owner_name: editForm.owner_name,
					owner_msisdn: editForm.owner_msisdn
				});
			}
			isDialogOpen = false;
			editingItem = null;
			await queryClient.invalidateQueries({ queryKey: ['potentials', 'list'] });
		} catch (error) {
			console.error('Failed to save potential:', error);
		}
	}

	async function handleDelete(id: number) {
		if (confirm('Apakah Anda yakin ingin menghapus potensi/UMKM ini?')) {
			try {
				await deletePotential({ id });
				await queryClient.invalidateQueries({ queryKey: ['potentials', 'list'] });
			} catch (error) {
				console.error('Failed to delete potential:', error);
			}
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
		<Button onclick={handleCreate}>
			<Plus size={16} strokeWidth={2.5} />
			Tambah Potensi Baru
		</Button>
	</div>

	<div
		class="flex flex-col gap-4 md:flex-row md:items-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
	>
		<div class="relative flex-1">
			<span class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
				<Search size={16} />
			</span>
			<Input placeholder="Cari potensi atau nama pemilik..." class="pl-9 bg-slate-50/50" />
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
					<TableHead>Potensi / UMKM</TableHead>
					<TableHead>Slug & Subtitle</TableHead>
					<TableHead>Deskripsi</TableHead>
					<TableHead class="text-center">Kategori</TableHead>
					<TableHead class="text-center">Loc. ID</TableHead>
					<TableHead class="text-center">Media ID</TableHead>
					<TableHead>Pengelola & Kontak</TableHead>
					<TableHead class="text-right">Aksi</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if potentials.length === 0}
					<TableRow>
						<TableCell colspan={9} class="text-center py-8 text-slate-400 font-medium">
							Belum ada data potensi & UMKM.
						</TableCell>
					</TableRow>
				{:else}
					{#each potentials as item, index (item.id)}
						<TableRow>
							<TableCell class="text-center font-bold text-slate-400">{index + 1}</TableCell>
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
									{item.category_name || getCategoryName(item.category_id)}
								</span>
							</TableCell>
							<TableCell class="text-center">
								<span
									class="inline-flex h-6 w-10 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-600"
								>
									#{item.location_id}
								</span>
							</TableCell>
							<TableCell class="text-center">
								<span
									class="inline-flex h-6 w-10 items-center justify-center rounded bg-blue-50 text-xs font-bold text-blue-700"
								>
									M:{item.media_id}
								</span>
							</TableCell>
							<TableCell class="text-xs">
								<span class="block font-bold text-slate-900">{item.owner_name}</span>
								<span class="block text-slate-400 text-[11px] font-semibold mt-0.5"
									>{item.owner_msisdn}</span
								>
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
	title={editingItem ? 'Ubah Potensi / UMKM' : 'Tambah Potensi Baru'}
	subtitle={editingItem
		? `ID: ${editingItem.id} | Mengubah komoditas desa`
		: 'Tambah komoditas desa baru'}
>
	<form onsubmit={handleSave} class="flex flex-col p-6 space-y-4 max-h-[70vh] overflow-y-auto">
		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-1.5">
				<label
					for="edit-title"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Potensi</label
				>
				<Input id="edit-title" bind:value={editForm.title} required />
			</div>
			<div class="space-y-1.5">
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
			<Textarea id="edit-desc" bind:value={editForm.description} rows={3} required />
		</div>

		<div class="grid grid-cols-3 gap-3">
			<div class="space-y-1.5">
				<label
					for="edit-category"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Kategori</label
				>
				<select
					id="edit-category"
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
			<div class="space-y-1.5">
				<label for="edit-loc" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>Loc. ID</label
				>
				<Input type="number" id="edit-loc" bind:value={editForm.location_id} required />
			</div>
			<div class="space-y-1.5">
				<label for="edit-med" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>Media ID</label
				>
				<Input type="number" id="edit-med" bind:value={editForm.media_id} required />
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-1.5">
				<label
					for="edit-owner"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>Nama Pengelola</label
				>
				<Input id="edit-owner" bind:value={editForm.owner_name} required />
			</div>
			<div class="space-y-1.5">
				<label
					for="edit-msisdn"
					class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>No. Kontak (MSISDN)</label
				>
				<Input id="edit-msisdn" bind:value={editForm.owner_msisdn} required />
			</div>
		</div>

		{#if !editingItem}
			<div class="space-y-1.5">
				<label for="edit-by" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>Uploader ID</label
				>
				<Input type="number" id="edit-by" bind:value={editForm.uploaded_by} required />
			</div>
		{/if}

		<div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
			<Button variant="outline" onclick={() => (isDialogOpen = false)}>Batal</Button>
			<Button type="submit">Simpan Perubahan</Button>
		</div>
	</form>
</Dialog>
