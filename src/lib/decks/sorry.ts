import type { Deck, DeckCard } from '../types';

export const sorryDeck: Deck = {
	id: 'sorry',
	name: 'Sorry!',
	//defaultBackColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
	defaultBackColor:
		'conic-gradient(from 0deg, #d8d508 0deg, #d8d508 90deg, #5fa438 90deg, #5fa438 180deg, #d9122f 180deg, #d9122f 270deg, #09a1ee 270deg, #09a1ee 360deg)',
	defaultFrontColor: '#ffffff',
	emptyDeckBehavior: 'shuffle',
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
