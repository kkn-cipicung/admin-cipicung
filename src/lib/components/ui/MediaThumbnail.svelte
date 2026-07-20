<script lang="ts">
	import { getMediaUrlCandidates } from '../../../utils/media';

	let {
		media,
		alt = 'Media',
		class: className = ''
	}: {
		media: number | string | null | undefined;
		alt?: string;
		class?: string;
	} = $props();

	let activeIndex = $state(0);
	let hasFailed = $state(false);
	let candidates = $derived(getMediaUrlCandidates(media));
	let src = $derived(candidates[activeIndex] || '');
	let label = $derived(
		media === null || media === undefined || media === '' ? '-' : `Media #${media}`
	);

	$effect(() => {
		if (media || !media) {
			activeIndex = 0;
			hasFailed = false;
		}
	});

	function handleError() {
		if (activeIndex < candidates.length - 1) {
			activeIndex += 1;
			return;
		}

		hasFailed = true;
	}
</script>

{#if src && !hasFailed}
	<img
		{src}
		{alt}
		class="mx-auto h-12 w-20 rounded-lg border border-slate-200 bg-slate-100 object-cover {className}"
		loading="lazy"
		onerror={handleError}
	/>
{:else}
	<span
		class="mx-auto inline-flex h-12 w-20 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 text-center text-[10px] font-bold text-slate-500"
	>
		{label}
	</span>
{/if}
