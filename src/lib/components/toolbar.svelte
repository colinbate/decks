<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import { gameState } from '$lib/game-state.svelte';
	import { onMount } from 'svelte';

	let menu: HTMLDivElement | null = null;
	let open = $state(false);

	onNavigate(() => {
		menu?.hidePopover();
	});

	onMount(() => {
		if (menu) {
			menu.addEventListener('toggle', (ev) => {
				open = (ev as ToggleEvent).newState === 'open';
			});
		}
	});
</script>

<!-- Include this script tag or install `@tailwindplus/elements` via npm: -->
<!-- <script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script> -->
<nav class="bg-gray-800">
	<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
		<div class="relative flex h-12 items-center justify-between">
			<a class="flex flex-1 items-center justify-start gap-3" href="/">
				<div class="flex shrink-0 items-center">
					<img src={favicon} alt="Decks!" class="h-7 w-auto" />
				</div>
				<h1 class="text-xl font-bold text-white">
					{gameState.deck?.name}
				</h1>
			</a>
			<div
				class="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:gap-4 sm:pr-0"
			>
				<button
					type="button"
					class="flex cursor-pointer items-center gap-2 text-white"
					onclick={() => gameState.newGame()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</svg>
					<span class="sr-only sm:not-sr-only">Reset Deck</span>
				</button>
				<!-- Profile dropdown -->
				<div class="relative ml-3">
					<button
						popovertarget="navmenu"
						class="relative flex rounded-full bg-gray-800 text-sm text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
					>
						<span class="absolute -inset-1.5"></span>
						<span class="sr-only">Open user menu</span>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							data-slot="icon"
							aria-hidden="true"
							class="size-6"
						>
							<path
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>

					<div
						id="navmenu"
						bind:this={menu}
						{...open ? {} : { 'data-closed': true }}
						popover="auto"
						class="mt-10 mr-4 ml-auto w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
					>
						<a
							href="/players"
							class="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden"
							>Set Players</a
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</nav>
