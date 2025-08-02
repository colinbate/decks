<script lang="ts">
	import { onMount } from 'svelte';

	let { text }: { text: string } = $props();
	let lastText: string | null = null;

	let svg: SVGElement | null = null;
	onMount(() => {
		if (svg && text !== lastText) {
			lastText = text;
			const bbox = svg.querySelector('text')?.getBBox();
			/* Apply bounding box to SVG element as viewBox */
			if (bbox) {
				svg.setAttribute('viewBox', [bbox.x, bbox.y, bbox.width, bbox.height].join(' '));
			}
		}
	});
</script>

<svg viewBox="0 0 100 100" class="w-full" bind:this={svg}
	><text x="0" y="0" dominant-baseline="text-before-edge">{text}</text></svg
>
