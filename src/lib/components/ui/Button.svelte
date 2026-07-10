<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		type = 'button',
		variant = 'primary',
		size = 'default',
		children,
		class: className = '',
		...restProps
	}: {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
		size?: 'default' | 'sm' | 'lg' | 'icon';
		children?: Snippet;
		class?: string;
	} & HTMLButtonAttributes = $props();

	const variants = {
		primary:
			'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10 active:scale-[0.98]',
		secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-[0.98]',
		outline:
			'border border-slate-250 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.98]',
		destructive:
			'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/10 active:scale-[0.98]',
		ghost: 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
	};

	const sizes = {
		default: 'px-4 py-2.5 text-xs font-bold rounded-xl',
		sm: 'px-3 py-1.5 text-[11px] font-bold rounded-lg',
		lg: 'px-5 py-3 text-sm font-bold rounded-2xl',
		icon: 'h-8 w-8 flex items-center justify-center rounded-lg'
	};
</script>

<button
	{type}
	class="inline-flex items-center justify-center gap-1.5 transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:pointer-events-none {variants[
		variant
	]} {sizes[size]} {className}"
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</button>
