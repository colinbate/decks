<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/card.svelte';
	import { shuffleArray } from '$lib/shuffle';

	interface DeckCard {
		id: string;
		text: string;
		frontImage?: string;
		backImage?: string;
		frontColor?: string;
		backColor?: string;
	}

	// Sorry! deck definition
	const sorryDeck = {
		name: 'Sorry!',
		//defaultBackColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		defaultBackColor:
			'conic-gradient(from 0deg, #d8d508 0deg, #d8d508 90deg, #5fa438 90deg, #5fa438 180deg, #d9122f 180deg, #d9122f 270deg, #09a1ee 270deg, #09a1ee 360deg)',
		defaultFrontColor: '#ffffff',
		emptyDeckBehavior: 'shuffle' as const,
		emptyDeckMessage: 'Deck Empty!',
		cards: [
			// 5x "1" cards
			...Array(5)
				.fill(null)
				.map((_, i) => ({ id: `1-${i}`, text: '1' })),
			// 4x each of the other numbers
			...['2', '3', '4', '5', '7', '8', '10', '11', '12'].flatMap((num) =>
				Array(4)
					.fill(null)
					.map((_, i) => ({ id: `${num}-${i}`, text: num }))
			),
			// 4x "SORRY" cards
			...Array(4)
				.fill(null)
				.map((_, i) => ({ id: `sorry-${i}`, text: 'SORRY!' })),
		] as DeckCard[],
	};

	let deck: DeckCard[] = $state([]);
	let discardPile: DeckCard[] = $state([]);
	let selectedCard: DeckCard | null = $state(null);
	let isPortrait = $state(true);
	let dialogElement: HTMLDialogElement;

	// Initialize with shuffled deck
	function resetDeck(): void {
		deck = shuffleArray(sorryDeck.cards);
		discardPile = [];
		selectedCard = null;
	}

	function checkOrientation(): void {
		isPortrait = window.innerHeight > window.innerWidth;
	}

	function drawCard(): void {
		if (deck.length === 0) {
			if (sorryDeck.emptyDeckBehavior === 'shuffle' && discardPile.length > 0) {
				resetDeck();
				// Draw the first card after shuffling
				if (deck.length > 0) {
					selectedCard = deck[deck.length - 1];
					dialogElement?.showModal();
				}
			}
			return;
		}

		const card = deck[deck.length - 1];
		selectedCard = card;
		dialogElement?.showModal();
	}

	function confirmCard(): void {
		if (!selectedCard) return;

		discardPile = [selectedCard, ...discardPile];
		deck = deck.filter((card) => card.id !== selectedCard!.id);
		selectedCard = null;
		dialogElement?.close();
	}

	function cancelSelection(): void {
		selectedCard = null;
		dialogElement?.close();
	}

	function handleDialogClose(): void {
		selectedCard = null;
	}

	onMount(() => {
		resetDeck();
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
	class="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-50 to-slate-300 p-4"
>
	<!-- Game Controls -->
	<div class="mb-4 flex gap-4">
		<button
			onclick={resetDeck}
			class="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600"
		>
			New Game
		</button>
	</div>

	<div
		class="deck-area flex w-full max-w-4xl items-center justify-center gap-8 {isPortrait
			? 'flex-col gap-6'
			: ''}"
	>
		<!-- Draw Pile -->
		<div class="pile-container flex max-w-sm flex-1 flex-col items-center gap-4">
			<h2 class="text-center text-xl font-semibold text-slate-700">Draw Pile ({deck.length})</h2>
			<div class="pile-wrapper">
				{#if deck.length > 0}
					<button class="pile-button" onclick={drawCard} aria-label="Draw a card">
						<Card
							card={deck[deck.length - 1]}
							deckConfig={sorryDeck}
							isBack={true}
							isClickable={true}
						/>
					</button>
				{:else if sorryDeck.emptyDeckBehavior === 'shuffle' && discardPile.length > 0}
					<button
						class="shuffle-button h-70 w-50 cursor-pointer rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
						onclick={resetDeck}
					>
						Shuffle & Restart
					</button>
				{:else}
					<div
						class="empty-pile flex h-70 w-50 items-center justify-center rounded-xl border-2 border-dashed border-slate-400 bg-white/50 font-medium text-slate-600"
					>
						{sorryDeck.emptyDeckMessage || 'Deck Empty'}
					</div>
				{/if}
			</div>
		</div>

		<!-- Discard Pile -->
		<div class="pile-container flex max-w-sm flex-1 flex-col items-center gap-4">
			<h2 class="text-center text-xl font-semibold text-slate-700">
				Discard Pile ({discardPile.length})
			</h2>
			<div class="pile relative">
				{#if discardPile.length > 0}
					<Card card={discardPile[0]} deckConfig={sorryDeck} isBack={false} />
				{:else}
					<div
						class="empty-pile flex h-70 w-50 items-center justify-center rounded-xl border-2 border-dashed border-slate-400 bg-white/50 font-medium text-slate-600"
					>
						Empty
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Selected Card Dialog -->
	<dialog bind:this={dialogElement} onclose={handleDialogClose} class="card-dialog">
		{#if selectedCard}
			<div class="dialog-content">
				<Card card={selectedCard} deckConfig={sorryDeck} isBack={false} isModal={true} />
				<div class="dialog-actions">
					<button onclick={confirmCard} class="confirm-btn">Add to Discard</button>
					<button onclick={cancelSelection} class="cancel-btn">Return to Draw Pile</button>
				</div>
			</div>
		{/if}
	</dialog>
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

	.confirm-btn,
	.cancel-btn {
		padding: 0.75rem 1.5rem;
		font-weight: 600;
		border-radius: 0.5rem;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.confirm-btn {
		background: #10b981;
		color: white;
	}

	.confirm-btn:hover {
		background: #059669;
	}

	.cancel-btn {
		background: #64748b;
		color: white;
	}

	.cancel-btn:hover {
		background: #475569;
	}

	.pile-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.pile-button:hover {
		transform: translateY(-2px);
	}

	.pile-button:active {
		transform: translateY(0);
	}

	.pile-button:focus-visible {
		outline: 2px solid #3b82f6;
		outline-offset: 4px;
		border-radius: 12px;
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

		.confirm-btn,
		.cancel-btn {
			width: 100%;
		}
	}
</style>
