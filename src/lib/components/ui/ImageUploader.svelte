<script lang="ts">
	import { fileToBase64, parseBase64Image } from '../../../utils/base64';
	import { getMediaUrl } from '../../../utils/media';
	import { fade, scale as scaleTransition } from 'svelte/transition';
	import { ImageUp, X, Crop, Upload, AlertCircle } from '@lucide/svelte';
	import Button from './Button.svelte';
	import Dialog from './Dialog.svelte';
	import ImageCropper from './ImageCropper.svelte';

	let {
		value = $bindable(''),
		aspectRatio = null,
		maxSizeMB = 10,
		placeholder = 'Seret gambar ke sini atau klik untuk memilih',
		disabled = false,
		class: className = ''
	}: {
		value?: string;
		aspectRatio?: number | null;
		maxSizeMB?: number;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
	} = $props();

	let isDragOver = $state(false);
	let errorMessage = $state('');
	let originalDataUrl = $state('');
	let isCropOpen = $state(false);
	let fileInputEl: HTMLInputElement | undefined = $state();

	let dragCounter = $state(0);

	let displayUrl = $derived(getMediaUrl(value));

	let imageInfo = $derived(() => {
		if (!value) return null;
		return parseBase64Image(value);
	});

	function handleFiles(files: FileList | null) {
		errorMessage = '';
		if (!files || files.length === 0) return;

		const file = files[0];

		if (!file.type.startsWith('image/')) {
			errorMessage = 'File bukan gambar. Silakan pilih file gambar (PNG, JPG, GIF, WebP).';
			return;
		}

		const sizeMB = file.size / (1024 * 1024);
		if (sizeMB > maxSizeMB) {
			errorMessage = `Ukuran file terlalu besar (${sizeMB.toFixed(1)}MB). Maksimal ${maxSizeMB}MB.`;
			return;
		}

		fileToBase64(file)
			.then((dataUrl) => {
				originalDataUrl = dataUrl;
				value = dataUrl;
			})
			.catch(() => {
				errorMessage = 'Gagal membaca file. Silakan coba lagi.';
			});
	}

	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		dragCounter++;
		isDragOver = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		dragCounter--;
		if (dragCounter <= 0) {
			dragCounter = 0;
			isDragOver = false;
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragOver = false;
		dragCounter = 0;
		if (disabled) return;
		handleFiles(e.dataTransfer?.files ?? null);
	}

	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		handleFiles(target.files);
		target.value = '';
	}

	function openFilePicker() {
		if (disabled) return;
		fileInputEl?.click();
	}

	function clearImage() {
		value = '';
		originalDataUrl = '';
		errorMessage = '';
	}

	function openCrop() {
		const src = originalDataUrl || displayUrl || value;
		if (src) {
			originalDataUrl = src;
			isCropOpen = true;
		}
	}

	function handleCropApply(croppedDataUrl: string) {
		value = croppedDataUrl;
		isCropOpen = false;
	}

	function handleCropCancel() {
		isCropOpen = false;
	}

	function formatBytes(bytes: number | null): string {
		if (bytes === null) return '';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}
</script>

<div class="image-uploader-wrapper {className}">
	<input
		bind:this={fileInputEl}
		type="file"
		accept="image/*"
		class="hidden"
		onchange={handleInputChange}
		{disabled}
	/>

	{#if value}
		<div class="image-uploader-preview group" transition:fade={{ duration: 150 }}>
			<div class="image-uploader-preview-container">
				<img src={displayUrl} alt="Preview" class="image-uploader-preview-img" />

				<div class="image-uploader-overlay">
					<div class="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							class="!bg-white/15 !text-white backdrop-blur-sm hover:!bg-white/25 !border-0"
							onclick={openFilePicker}
						>
							<Upload size={14} />
							Ganti
						</Button>
						<Button
							variant="ghost"
							size="sm"
							class="!bg-white/15 !text-white backdrop-blur-sm hover:!bg-white/25 !border-0"
							onclick={openCrop}
						>
							<Crop size={14} />
							Crop
						</Button>
					</div>
				</div>
			</div>

			<div class="image-uploader-info">
				<div class="flex items-center gap-2 min-w-0">
					<div class="image-uploader-thumb">
						<img src={displayUrl} alt="" class="w-full h-full object-cover" />
					</div>
					<div class="min-w-0">
						<p class="text-[11px] font-bold text-slate-700 truncate">
							{imageInfo()?.mimeType || 'Gambar'}
						</p>
						<p class="text-[10px] font-semibold text-slate-400">
							{formatBytes(imageInfo()?.sizeBytes ?? null)}
						</p>
					</div>
				</div>
				<button
					type="button"
					class="image-uploader-remove"
					onclick={clearImage}
					title="Hapus gambar"
				>
					<X size={14} />
				</button>
			</div>
		</div>
	{:else}
		<div
			class="image-uploader-dropzone"
			class:image-uploader-dropzone-active={isDragOver}
			class:image-uploader-dropzone-disabled={disabled}
			ondragenter={handleDragEnter}
			ondragleave={handleDragLeave}
			ondragover={handleDragOver}
			ondrop={handleDrop}
			onclick={openFilePicker}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') openFilePicker();
			}}
			role="button"
			tabindex={disabled ? -1 : 0}
		>
			<div class="image-uploader-dropzone-inner">
				{#if isDragOver}
					<div
						class="image-uploader-dropzone-icon image-uploader-dropzone-icon-active"
						transition:scaleTransition={{ duration: 200 }}
					>
						<Upload size={24} strokeWidth={2} />
					</div>
					<p class="text-sm font-bold text-blue-600">Lepaskan file di sini</p>
				{:else}
					<div class="image-uploader-dropzone-icon">
						<ImageUp size={24} strokeWidth={1.5} />
					</div>
					<div class="text-center">
						<p class="text-xs font-bold text-slate-600">{placeholder}</p>
						<p class="text-[10px] font-semibold text-slate-400 mt-1">
							PNG, JPG, GIF, atau WebP — Maks {maxSizeMB}MB
						</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	{#if errorMessage}
		<div class="image-uploader-error" transition:fade={{ duration: 150 }}>
			<AlertCircle size={14} />
			<span>{errorMessage}</span>
		</div>
	{/if}
</div>

<Dialog
	bind:isOpen={isCropOpen}
	title="Potong Gambar"
	subtitle="Sesuaikan area yang ingin diambil"
	maxWidth="max-w-2xl"
>
	<div class="p-5" style="height: 500px;">
		<ImageCropper
			imageDataUrl={originalDataUrl}
			{aspectRatio}
			onApply={handleCropApply}
			onCancel={handleCropCancel}
		/>
	</div>
</Dialog>

<style>
	.image-uploader-wrapper {
		width: 100%;
	}

	.image-uploader-dropzone {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 160px;
		padding: 24px;
		border-radius: 16px;
		border: 2px dashed color-mix(in srgb, var(--color-slate-300) 80%, transparent);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--color-slate-50) 50%, transparent),
			color-mix(in srgb, var(--color-blue-50) 20%, transparent)
		);
		cursor: pointer;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		outline: none;
	}

	.image-uploader-dropzone:hover {
		border-color: var(--color-blue-300);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--color-blue-50) 50%, transparent),
			color-mix(in srgb, var(--color-blue-100) 30%, transparent)
		);
	}

	.image-uploader-dropzone:focus-visible {
		border-color: var(--color-blue-400);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-blue-500) 20%, transparent);
	}

	.image-uploader-dropzone-active {
		border-color: var(--color-blue-400) !important;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--color-blue-50) 80%, transparent),
			color-mix(in srgb, var(--color-blue-100) 50%, transparent)
		) !important;
		transform: scale(1.01);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-blue-500) 15%, transparent);
	}

	.image-uploader-dropzone-disabled {
		opacity: 0.5;
		pointer-events: none;
		cursor: not-allowed;
	}

	.image-uploader-dropzone-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.image-uploader-dropzone-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
		border-radius: 14px;
		background: linear-gradient(135deg, var(--color-slate-100), var(--color-slate-50));
		color: var(--color-slate-400);
		transition: all 0.25s ease;
	}

	.image-uploader-dropzone:hover .image-uploader-dropzone-icon {
		background: linear-gradient(135deg, var(--color-blue-100), var(--color-blue-50));
		color: var(--color-blue-500);
		transform: translateY(-2px);
	}

	.image-uploader-dropzone-icon-active {
		background: linear-gradient(135deg, var(--color-blue-100), var(--color-blue-50)) !important;
		color: var(--color-blue-500) !important;
		animation: bounce-subtle 0.6s ease infinite alternate;
	}

	@keyframes bounce-subtle {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-4px);
		}
	}

	/* Preview */
	.image-uploader-preview {
		border-radius: 16px;
		border: 1px solid var(--color-slate-200);
		background: var(--color-white);
		overflow: hidden;
		box-shadow: 0 1px 3px color-mix(in srgb, var(--color-slate-900) 4%, transparent);
	}

	.image-uploader-preview-container {
		position: relative;
		width: 100%;
		max-height: 280px;
		overflow: hidden;
		background: repeating-conic-gradient(var(--color-slate-100) 0% 25%, transparent 0% 50%) 0 0 /
			16px 16px;
	}

	.image-uploader-preview-img {
		display: block;
		width: 100%;
		max-height: 280px;
		object-fit: contain;
	}

	.image-uploader-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--color-slate-900) 40%, transparent);
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.image-uploader-preview:hover .image-uploader-overlay {
		opacity: 1;
	}

	.image-uploader-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 14px;
		border-top: 1px solid var(--color-slate-100);
		background: color-mix(in srgb, var(--color-slate-50) 50%, transparent);
	}

	.image-uploader-thumb {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid var(--color-slate-200);
		flex-shrink: 0;
	}

	.image-uploader-remove {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		border: none;
		background: transparent;
		color: var(--color-slate-400);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.image-uploader-remove:hover {
		background: color-mix(in srgb, var(--color-red-50) 80%, transparent);
		color: var(--color-red-500);
	}

	/* Error */
	.image-uploader-error {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 8px;
		padding: 8px 12px;
		border-radius: 10px;
		background: color-mix(in srgb, var(--color-red-50) 70%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-red-200) 50%, transparent);
		color: var(--color-red-600);
		font-size: 11px;
		font-weight: 600;
	}
</style>
