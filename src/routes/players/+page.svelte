<script lang="ts">
	import { gameState } from '$lib/game-state.svelte';
	import { shuffleArray } from '$lib/shuffle';
	function shuffle() {
		shuffleArray(gameState.players);
	}
</script>

<main
	class="flex flex-1 flex-col items-center justify-start gap-6 bg-gradient-to-br from-slate-50 to-slate-300 p-4"
>
	<h2 class="flex w-full items-center justify-between gap-4 text-2xl font-bold">
		Players
		<button
			type="button"
			aria-label="Add Player"
			onclick={() => gameState.players.push('')}
			class="flex size-8 items-center justify-center rounded-full bg-indigo-600 text-sm text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>
		</button>
	</h2>
	<form class="mb-4 w-full">
		{#each gameState.players, index (index)}
			<div class="mb-4">
				<label for="email" class="block text-sm/6 font-medium text-gray-900"
					>Player {index + 1}</label
				>
				<div class="mt-2">
					<input
						id={`player-${index}`}
						type="text"
						name={`player-${index}`}
						placeholder="Name or nickname..."
						bind:value={gameState.players[index]}
						class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					/>
				</div>
			</div>
		{/each}
	</form>
	<div class="flex items-center gap-4">
		<a href="/" class="block rounded-md bg-[#ff3e00] px-4 py-2 text-white">Return to Deck</a>
		<button type="button" class="rounded-md bg-[#ff3e00] px-4 py-2 text-white" onclick={shuffle}
			>Shuffle Players</button
		>
	</div>
</main>
