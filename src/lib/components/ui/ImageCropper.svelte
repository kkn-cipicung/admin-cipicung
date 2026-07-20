<script lang="ts">
	import { onMount } from 'svelte';
	import { cropBase64Image, type CropRect } from '../../../utils/base64';
	import Button from './Button.svelte';

	let {
		imageDataUrl,
		aspectRatio = null,
		onApply,
		onCancel
	}: {
		imageDataUrl: string;
		aspectRatio?: number | null;
		onApply: (croppedDataUrl: string) => void;
		onCancel: () => void;
	} = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let canvasEl: HTMLCanvasElement | undefined = $state();
	let img: HTMLImageElement | null = $state(null);

	// Image display dimensions (fitted into the container)
	let displayWidth = $state(0);
	let displayHeight = $state(0);
	let offsetX = $state(0);
	let offsetY = $state(0);
	let scale = $state(1);

	// Crop rect in display coordinates
	let crop = $state<CropRect>({ x: 0, y: 0, width: 0, height: 0 });

	// Interaction state
	let isDragging = $state(false);
	let isResizing = $state(false);
	let activeHandle = $state('');
	let dragStartX = $state(0);
	let dragStartY = $state(0);
	let cropStart = $state<CropRect>({ x: 0, y: 0, width: 0, height: 0 });

	let isApplying = $state(false);

	const MIN_CROP = 30;
	const HANDLE_SIZE = 12;

	onMount(() => {
		const image = new Image();
		image.onload = () => {
			img = image;
			fitImage();
		};
		image.src = imageDataUrl;
	});

	function fitImage() {
		if (!img || !containerEl) return;

		const containerW = containerEl.clientWidth;
		const containerH = containerEl.clientHeight;
		const imgW = img.naturalWidth;
		const imgH = img.naturalHeight;

		scale = Math.min(containerW / imgW, containerH / imgH, 1);
		displayWidth = Math.round(imgW * scale);
		displayHeight = Math.round(imgH * scale);
		offsetX = Math.round((containerW - displayWidth) / 2);
		offsetY = Math.round((containerH - displayHeight) / 2);

		// Initialize crop to centered 80% of image
		const initW = Math.round(displayWidth * 0.8);
		let initH = Math.round(displayHeight * 0.8);

		if (aspectRatio) {
			initH = Math.round(initW / aspectRatio);
			if (initH > displayHeight * 0.9) {
				initH = Math.round(displayHeight * 0.9);
			}
		}

		const finalW = aspectRatio ? Math.round(initH * aspectRatio) : initW;

		crop = {
			x: Math.round((displayWidth - finalW) / 2),
			y: Math.round((displayHeight - initH) / 2),
			width: finalW,
			height: initH
		};

		draw();
	}

	function draw() {
		if (!canvasEl || !img || !containerEl) return;

		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		const cW = containerEl.clientWidth;
		const cH = containerEl.clientHeight;
		canvasEl.width = cW;
		canvasEl.height = cH;

		ctx.clearRect(0, 0, cW, cH);

		ctx.drawImage(img, offsetX, offsetY, displayWidth, displayHeight);

		ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';

		const cropAbsX = offsetX + crop.x;
		const cropAbsY = offsetY + crop.y;

		ctx.fillRect(0, 0, cW, cropAbsY);
		ctx.fillRect(0, cropAbsY + crop.height, cW, cH - cropAbsY - crop.height);
		ctx.fillRect(0, cropAbsY, cropAbsX, crop.height);
		ctx.fillRect(cropAbsX + crop.width, cropAbsY, cW - cropAbsX - crop.width, crop.height);

		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 2;
		ctx.strokeRect(cropAbsX, cropAbsY, crop.width, crop.height);

		ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.lineWidth = 1;
		for (let i = 1; i <= 2; i++) {
			const gx = cropAbsX + (crop.width * i) / 3;
			const gy = cropAbsY + (crop.height * i) / 3;
			ctx.beginPath();
			ctx.moveTo(gx, cropAbsY);
			ctx.lineTo(gx, cropAbsY + crop.height);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(cropAbsX, gy);
			ctx.lineTo(cropAbsX + crop.width, gy);
			ctx.stroke();
		}

		ctx.fillStyle = '#ffffff';
		ctx.strokeStyle = '#3b82f6';
		ctx.lineWidth = 2;
		const hs = HANDLE_SIZE;
		const handles = [
			{ x: cropAbsX - hs / 2, y: cropAbsY - hs / 2 },
			{ x: cropAbsX + crop.width - hs / 2, y: cropAbsY - hs / 2 },
			{ x: cropAbsX - hs / 2, y: cropAbsY + crop.height - hs / 2 },
			{ x: cropAbsX + crop.width - hs / 2, y: cropAbsY + crop.height - hs / 2 }
		];
		handles.forEach((h) => {
			ctx.fillRect(h.x, h.y, hs, hs);
			ctx.strokeRect(h.x, h.y, hs, hs);
		});

		const realW = Math.round(crop.width / scale);
		const realH = Math.round(crop.height / scale);
		const label = `${realW} × ${realH}`;
		ctx.font = '600 11px Inter, system-ui, sans-serif';
		const textMetrics = ctx.measureText(label);
		const labelW = textMetrics.width + 16;
		const labelH = 22;
		const labelX = cropAbsX + crop.width / 2 - labelW / 2;
		const labelY = cropAbsY + crop.height + 8;

		ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
		ctx.beginPath();
		ctx.roundRect(labelX, labelY, labelW, labelH, 6);
		ctx.fill();
		ctx.fillStyle = '#ffffff';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(label, cropAbsX + crop.width / 2, labelY + labelH / 2);
	}

	$effect(() => {
		if (crop && img) draw();
	});

	function getHandleAtPoint(px: number, py: number): string {
		const cropAbsX = offsetX + crop.x;
		const cropAbsY = offsetY + crop.y;
		const tolerance = HANDLE_SIZE + 4;

		const corners = [
			{ name: 'tl', x: cropAbsX, y: cropAbsY },
			{ name: 'tr', x: cropAbsX + crop.width, y: cropAbsY },
			{ name: 'bl', x: cropAbsX, y: cropAbsY + crop.height },
			{ name: 'br', x: cropAbsX + crop.width, y: cropAbsY + crop.height }
		];

		for (const c of corners) {
			if (Math.abs(px - c.x) < tolerance && Math.abs(py - c.y) < tolerance) {
				return c.name;
			}
		}
		return '';
	}

	function isInsideCrop(px: number, py: number): boolean {
		const cropAbsX = offsetX + crop.x;
		const cropAbsY = offsetY + crop.y;
		return (
			px >= cropAbsX &&
			px <= cropAbsX + crop.width &&
			py >= cropAbsY &&
			py <= cropAbsY + crop.height
		);
	}

	function handlePointerDown(e: PointerEvent) {
		if (!canvasEl) return;
		const rect = canvasEl.getBoundingClientRect();
		const px = e.clientX - rect.left;
		const py = e.clientY - rect.top;

		const handle = getHandleAtPoint(px, py);
		if (handle) {
			isResizing = true;
			activeHandle = handle;
		} else if (isInsideCrop(px, py)) {
			isDragging = true;
		} else {
			return;
		}

		dragStartX = px;
		dragStartY = py;
		cropStart = { ...crop };
		canvasEl.setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!canvasEl) return;
		const rect = canvasEl.getBoundingClientRect();
		const px = e.clientX - rect.left;
		const py = e.clientY - rect.top;

		if (!isDragging && !isResizing) {
			const handle = getHandleAtPoint(px, py);
			if (handle === 'tl' || handle === 'br') canvasEl.style.cursor = 'nwse-resize';
			else if (handle === 'tr' || handle === 'bl') canvasEl.style.cursor = 'nesw-resize';
			else if (isInsideCrop(px, py)) canvasEl.style.cursor = 'move';
			else canvasEl.style.cursor = 'default';
			return;
		}

		const dx = px - dragStartX;
		const dy = py - dragStartY;

		if (isDragging) {
			let newX = cropStart.x + dx;
			let newY = cropStart.y + dy;

			newX = Math.max(0, Math.min(newX, displayWidth - crop.width));
			newY = Math.max(0, Math.min(newY, displayHeight - crop.height));

			crop = { ...crop, x: newX, y: newY };
		} else if (isResizing) {
			let newCrop = { ...cropStart };

			if (activeHandle.includes('r')) {
				newCrop.width = Math.max(MIN_CROP, cropStart.width + dx);
			}
			if (activeHandle.includes('l')) {
				const maxDx = cropStart.width - MIN_CROP;
				const clampedDx = Math.min(dx, maxDx);
				newCrop.x = cropStart.x + clampedDx;
				newCrop.width = cropStart.width - clampedDx;
			}
			if (activeHandle.includes('b')) {
				newCrop.height = Math.max(MIN_CROP, cropStart.height + dy);
			}
			if (activeHandle.includes('t')) {
				const maxDy = cropStart.height - MIN_CROP;
				const clampedDy = Math.min(dy, maxDy);
				newCrop.y = cropStart.y + clampedDy;
				newCrop.height = cropStart.height - clampedDy;
			}

			if (aspectRatio) {
				if (activeHandle.includes('r') || activeHandle.includes('l')) {
					newCrop.height = Math.round(newCrop.width / aspectRatio);
				} else {
					newCrop.width = Math.round(newCrop.height * aspectRatio);
				}
			}

			newCrop.x = Math.max(0, newCrop.x);
			newCrop.y = Math.max(0, newCrop.y);
			newCrop.width = Math.min(newCrop.width, displayWidth - newCrop.x);
			newCrop.height = Math.min(newCrop.height, displayHeight - newCrop.y);

			crop = newCrop;
		}
	}

	function handlePointerUp() {
		isDragging = false;
		isResizing = false;
		activeHandle = '';
	}

	async function applyCrop() {
		isApplying = true;
		try {
			const realCrop: CropRect = {
				x: Math.round(crop.x / scale),
				y: Math.round(crop.y / scale),
				width: Math.round(crop.width / scale),
				height: Math.round(crop.height / scale)
			};
			const result = await cropBase64Image(imageDataUrl, realCrop);
			onApply(result);
		} catch (err) {
			console.error('Crop failed:', err);
		} finally {
			isApplying = false;
		}
	}
</script>

<div class="flex flex-col h-full gap-4">
	<div
		bind:this={containerEl}
		class="relative flex-1 min-h-[300px] bg-slate-950 rounded-xl overflow-hidden select-none"
	>
		<canvas
			bind:this={canvasEl}
			class="absolute inset-0 w-full h-full"
			onpointerdown={handlePointerDown}
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			onpointerleave={handlePointerUp}
		></canvas>
	</div>

	<!-- Actions -->
	<div class="flex items-center justify-between">
		<p class="text-[11px] font-semibold text-slate-400">
			Seret untuk memindahkan • Tarik sudut untuk mengubah ukuran
		</p>
		<div class="flex items-center gap-2">
			<Button variant="outline" onclick={onCancel}>Batal</Button>
			<Button onclick={applyCrop} disabled={isApplying}>
				{#if isApplying}
					<svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"
						></circle>
						<path
							d="M4 12a8 8 0 018-8"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
							class="opacity-75"
						></path>
					</svg>
				{/if}
				Terapkan Crop
			</Button>
		</div>
	</div>
</div>
