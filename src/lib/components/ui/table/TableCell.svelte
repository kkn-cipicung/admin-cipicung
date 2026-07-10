<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLTdAttributes } from 'svelte/elements';

	let {
		children,
		class: className = '',
		...restProps
	}: { children?: Snippet; class?: string } & HTMLTdAttributes = $props();
</script>

<td class="px-6 py-4 {className}" {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</td>
