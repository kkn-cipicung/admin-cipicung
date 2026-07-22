<script lang="ts" module>
	let activeDialogCount = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	let {
		isOpen = $bindable(false),
		title = '',
		subtitle = '',
		children,
		maxWidth = 'max-w-lg'
	}: {
		isOpen: boolean;
		title: string;
		subtitle?: string;
		children?: Snippet;
		maxWidth?: string;
	} = $props();

	$effect(() => {
		if (isOpen) {
			if (activeDialogCount === 0) {
				document.body.style.overflow = 'hidden';
			}
			activeDialogCount++;
			return () => {
				activeDialogCount = Math.max(0, activeDialogCount - 1);
				if (activeDialogCount === 0) {
					document.body.style.overflow = '';
				}
			};
		}
	});
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
	>
		<div
			class="w-full {maxWidth} max-h-[calc(100vh-2rem)] bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden"
		>
			<div
				class="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50 shrink-0"
			>
				<div class="flex flex-col">
					<h3 class="text-sm font-bold text-slate-900">{title}</h3>
					{#if subtitle}
						<p class="text-[11px] font-semibold text-slate-400">{subtitle}</p>
					{/if}
				</div>
				<button
					type="button"
					aria-label="Tutup dialog"
					onclick={() => (isOpen = false)}
					class="text-slate-400 hover:text-slate-700 rounded-lg p-1 hover:bg-slate-100 transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg
					>
				</button>
			</div>

			<div class="flex-1 overflow-y-auto min-h-0">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</div>
{/if}

