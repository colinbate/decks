<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Card from '$lib/components/card.svelte';
	import type { DeckCard } from '$lib/types';
	import { gameState } from '$lib/game-state.svelte';

	let selectedCard: DeckCard | null = $state(null);
	let isPortrait = $state(true);
	let moving = $state(false);
	// svelte-ignore non_reactive_update
	let dialogElement: HTMLDialogElement | null = null;

	function checkOrientation(): void {
		isPortrait = window.innerHeight > window.innerWidth;
	}

	function cancelSelection(): void {
		selectedCard = null;
		dialogElement?.close();
	}

	function handleDialogClose(): void {
		selectedCard = null;
	}

	async function delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function draw() {
		topDrawCard.moving = true;
		moving = true;
		if (!document.startViewTransition) {
			gameState.drawCard();
			topDiscardCard.moving = false;
			await delay(100);
			moving = false;
			gameState.nextTurn();
			return;
		}
		const transition = document.startViewTransition(async () => {
			gameState.drawCard();
			await tick();
		});
		await transition.finished;
		topDiscardCard.moving = false;
		await delay(100);
		moving = false;
		gameState.nextTurn();
	}

	let topDrawCard = $derived(gameState.drawPile[gameState.drawPile.length - 1]);
	let topDiscardCard = $derived(gameState.discardPile[0]);

	onMount(() => {
		gameState.selectedDeckId = 'sorry';
		gameState.newGame();
		checkOrientation();
		window.addEventListener('resize', checkOrientation);
		return () => window.removeEventListener('resize', checkOrientation);
	});
</script>

<svelte:head>
	<title>Decks!</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
</svelte:head>

<main
	class="flex w-full flex-1 flex-col items-center justify-center gap-4 overflow-y-hidden bg-gradient-to-br from-slate-50 to-slate-300 p-4"
>
	{#if gameState.players.length > 0}
		<div>
			Next to draw: {gameState.player}
		</div>
	{/if}
	{#if gameState.deck}
		<div
			class="deck-area grid h-full w-full max-w-4xl flex-1 items-center justify-center gap-4 perspective-normal {isPortrait
				? 'grid-cols-1 grid-rows-2'
				: 'grid-cols-2 grid-rows-1'}"
		>
			<div class="pile-wrapper relative h-full w-full">
				<div
					class="empty-pile box-border flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-400 bg-white/50 object-contain p-2 font-medium text-slate-600"
				>
					{#if gameState.drawPile.length > 0}
						{#if gameState.drawPile.length > 1}
							<Card
								card={gameState.drawPile[gameState.drawPile.length - 2]}
								deckConfig={gameState.deck}
								isBack={true}
								{isPortrait}
							/>
						{/if}
						<Card
							card={topDrawCard}
							deckConfig={gameState.deck}
							isBack={true}
							onclick={draw}
							{isPortrait}
						/>
					{:else if gameState.deck.emptyDeckBehavior === 'shuffle' && gameState.discardPile.length > 0}
						<button
							class="cursor-pointer rounded-md bg-gradient-to-br from-green-500 to-green-600 px-4 py-2 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
							onclick={() => gameState.resetDeck()}
						>
							Shuffle & Restock
						</button>
					{:else}
						{gameState.deck.emptyDeckMessage || 'Deck Empty'}
					{/if}
				</div>
				<span
					class="absolute top-0 right-0 inline-flex translate-x-1/2 -translate-y-1/2 items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/30 ring-inset"
					>{gameState.drawPile.length}</span
				>
			</div>

			<div class="pile relative size-full">
				<div
					class="empty-pile flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-400 bg-white/50 p-2 font-medium text-slate-600"
				>
					Empty
					{#each gameState.discardPile.slice(0, 2).reverse() as card, ii (card.id)}
						<Card
							{card}
							deckConfig={gameState.deck}
							isBack={moving ? ii === 1 || gameState.discardPile.length === 1 : false}
							{isPortrait}
						/>
					{/each}
				</div>
				<span
					class="absolute top-0 right-0 inline-flex translate-x-1/2 -translate-y-1/2 items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/30 ring-inset"
					>{gameState.discardPile.length}</span
				>
			</div>
		</div>
		<!-- Selected Card Dialog -->
		<dialog bind:this={dialogElement} onclose={handleDialogClose} class="card-dialog">
			{#if selectedCard}
				<div class="dialog-content">
					<Card
						card={selectedCard}
						deckConfig={gameState.deck}
						isBack={false}
						isModal={true}
						onclick={cancelSelection}
					/>

					<div class="dialog-actions">
						<button onclick={() => gameState.returnCard()} class="cancel-btn"
							>Return to Draw Pile</button
						>
					</div>
				</div>
			{/if}
		</dialog>
	{/if}
</main>

<style>
	/* Custom animations that Tailwind doesn't handle well */
	.card-dialog {
		border: none;
		padding: 0;
		background: transparent;
		max-width: 90vw;
		max-height: 90vh;
		margin: auto;
	}

	.card-dialog::backdrop {
		background: rgba(0, 0, 0, 0.7);
		animation: fadeIn 0.3s ease;
	}

	.dialog-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		animation: scaleIn 0.3s ease;
	}

	.dialog-actions {
		display: flex;
		gap: 1rem;
	}

	.cancel-btn {
		padding: 0.75rem 1.5rem;
		font-weight: 600;
		border-radius: 0.5rem;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.cancel-btn {
		background: #64748b;
		color: white;
	}

	.cancel-btn:hover {
		background: #475569;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes scaleIn {
		from {
			transform: scale(0.8);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@media (max-width: 768px) {
		.dialog-actions {
			flex-direction: column;
			width: 100%;
		}

		.cancel-btn {
			width: 100%;
		}
	}
</style>
