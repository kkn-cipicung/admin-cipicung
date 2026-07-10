<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLTableAttributes } from 'svelte/elements';

	let {
		children,
		class: className = '',
		...restProps
	}: { children?: Snippet; class?: string } & HTMLTableAttributes = $props();
</script>

<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
	<div class="overflow-x-auto">
		<table class="w-full border-collapse text-left text-sm {className}" {...restProps}>
			{#if children}
				{@render children()}
			{/if}
		</table>
	</div>
</div>
