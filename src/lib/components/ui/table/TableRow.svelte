<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		class: className = '',
		...restProps
	}: { children?: Snippet; class?: string } & HTMLAttributes<HTMLTableRowElement> = $props();
</script>

<tr class="hover:bg-slate-50/50 transition-colors {className}" {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</tr>
