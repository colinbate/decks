<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Toolbar from '$lib/components/toolbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<div class="flex min-h-dvh flex-col">
	<Toolbar />
	{@render children?.()}
</div>
