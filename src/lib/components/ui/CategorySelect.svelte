<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	export type CategorySelectOption = {
		id: number;
		name: string;
		type?: string;
	};

	let {
		value = $bindable(0),
		categories = [],
		placeholder = 'Pilih Kategori',
		allLabel = '',
		showType = false,
		class: className = '',
		...restProps
	}: {
		value?: string | number;
		categories?: CategorySelectOption[];
		placeholder?: string;
		allLabel?: string;
		showType?: boolean;
		class?: string;
	} & HTMLSelectAttributes = $props();
</script>

<select
	bind:value
	class="w-full min-w-0 rounded-xl border border-slate-250 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 {className}"
	{...restProps}
>
	{#if allLabel}
		<option value="">{allLabel}</option>
	{:else}
		<option value={0} disabled>{placeholder}</option>
	{/if}

	{#each categories as category (category.id)}
		<option value={category.id}>
			{category.name}{showType && category.type ? ` (${category.type})` : ''}
		</option>
	{/each}
</select>
