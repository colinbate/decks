import type { Deck, DeckCard } from './types';
import { shuffleArray } from '$lib/shuffle';
import { decks } from '$lib/decks';

class GameState {
	availableDecks: Deck[] = $state(decks);
	selectedDeckId: string | null = $state(null);
	deck: Deck | null = $derived(
		this.selectedDeckId
			? (this.availableDecks.find((deck) => deck.id === this.selectedDeckId) ?? null)
			: null
	);
	drawPile: DeckCard[] = $state([]);
	discardPile: DeckCard[] = $state([]);
	selectedCard: DeckCard | null = $state(null);
	players: string[] = $state([]);
	currentPlayer = $state(0);

	get player() {
		return this.players[this.currentPlayer];
	}

	resetDeck() {
		this.drawPile = this.deck ? shuffleArray([...this.deck.cards]) : [];
		this.discardPile = [];
		this.selectedCard = null;
	}

	newGame() {
		this.resetDeck();
		this.currentPlayer = 0;
	}

	returnCard() {
		if (this.discardPile.length === 0) return;
		const card = this.discardPile.shift()!;
		this.drawPile.push(card);
	}

	drawCard() {
		// if (this.drawPile.length === 0) {
		// 	if (this.deck.emptyDeckBehavior === 'shuffle' && this.discardPile.length > 0) {
		// 		this.resetDeck();
		// 		// Draw the first card after shuffling
		// 		if (this.drawPile.length > 0) {
		// 			this.selectedCard = this.drawPile[this.drawPile.length - 1];
		// 			dialogElement?.showModal();
		// 		}
		// 	}
		// 	return;
		// }
		if (this.drawPile.length === 0) return;
		const card = this.drawPile.pop()!;
		this.discardPile.unshift(card);
	}

	nextTurn() {
		this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
	}
}

export const gameState = new GameState();
