<script lang="ts">
	type Props = {
		value?: string;
		label: string;
		required?: boolean;
		id?: string;
		rows?: number;
		class?: string;
		[key: string]: unknown;
	};

	let {
		value = $bindable(''),
		label,
		required = false,
		id,
		rows = 3,
		class: className = '',
		...rest
	}: Props = $props();

	const fieldId = $derived(
		id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
	);
</script>

<div class="relative">
	<textarea
		id={fieldId}
		{required}
		{rows}
		bind:value
		placeholder=" "
		class={`peer w-full resize-y rounded-lg border border-slate-300 bg-white px-3 pt-5 pb-2 text-sm text-slate-900
			placeholder-transparent transition-colors
			focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
			${className}`}
		{...rest}
	></textarea>
	<label
		for={fieldId}
		class="pointer-events-none absolute left-3 top-2.5 text-sm font-medium text-slate-400 transition-all duration-150 ease-out
			peer-focus:top-2.5 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-blue-600
			peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:font-bold peer-not-placeholder-shown:text-slate-500"
	>
		{label}{#if required}<span class="text-red-500">&nbsp;*</span>{/if}
	</label>
</div>