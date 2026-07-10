<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLThAttributes } from 'svelte/elements';

	let {
		children,
		class: className = '',
		...restProps
	}: { children?: Snippet; class?: string } & HTMLThAttributes = $props();
</script>

<th class="px-6 py-3.5 {className}" {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</th>
