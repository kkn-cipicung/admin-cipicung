<script lang="ts">
	import Dialog from './Dialog.svelte';
	import Button from './Button.svelte';
	import { TriangleAlert, Loader2 } from '@lucide/svelte';

	let {
		isOpen = $bindable(false),
		title = 'Konfirmasi Hapus',
		description = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
		confirmLabel = 'Ya, Hapus',
		cancelLabel = 'Batal',
		loadingLabel = 'Menghapus...',
		isLoading = false,
		onConfirm,
		onCancel
	}: {
		isOpen: boolean;
		title?: string;
		description?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		loadingLabel?: string;
		isLoading?: boolean;
		onConfirm: () => void;
		onCancel?: () => void;
	} = $props();

	function handleCancel() {
		if (isLoading) return;
		isOpen = false;
		onCancel?.();
	}
</script>

<Dialog bind:isOpen {title} maxWidth="max-w-md">
	<div class="p-6">
		<div class="flex items-start gap-4">
			<div
				class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600"
			>
				<TriangleAlert size={22} strokeWidth={2.25} />
			</div>
			<p class="pt-1.5 text-sm font-semibold leading-relaxed text-slate-600">
				{description}
			</p>
		</div>

		<div class="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
			<Button variant="outline" onclick={handleCancel} disabled={isLoading}>
				{cancelLabel}
			</Button>
			<Button variant="destructive" onclick={onConfirm} disabled={isLoading}>
				{#if isLoading}
					<Loader2 size={16} class="animate-spin" />
					{loadingLabel}
				{:else}
					{confirmLabel}
				{/if}
			</Button>
		</div>
	</div>
</Dialog>
