<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		class: className = '',
		...restProps
	}: { children?: Snippet; class?: string } & HTMLAttributes<HTMLTableSectionElement> = $props();
</script>

<thead
	class="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold tracking-wider text-slate-500 uppercase {className}"
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</thead>
