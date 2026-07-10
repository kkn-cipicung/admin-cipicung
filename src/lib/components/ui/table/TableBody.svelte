<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		class: className = '',
		...restProps
	}: { children?: Snippet; class?: string } & HTMLAttributes<HTMLTableSectionElement> = $props();
</script>

<tbody class="divide-y divide-slate-100 font-medium text-slate-700 {className}" {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</tbody>
