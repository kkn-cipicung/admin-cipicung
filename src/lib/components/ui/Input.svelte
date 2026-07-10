<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		value = $bindable(''),
		class: className = '',
		...restProps
	}: {
		value?: string | number | null;
		class?: string;
	} & HTMLInputAttributes = $props();
</script>

<input
	bind:value
	class="w-full rounded-xl border border-slate-250 bg-white px-3.5 py-2 text-xs font-semibold placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 {className}"
	{...restProps}
/>
