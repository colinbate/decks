export interface DeckCard {
	id: string;
	text: string;
	moving?: boolean;
	frontImage?: string;
	backImage?: string;
	frontColor?: string;
	backColor?: string;
}

export interface Deck {
	id: string;
	name: string;
	defaultBackColor?: string;
	defaultFrontColor?: string;
	defaultBackImage?: string;
	defaultFrontImage?: string;
	emptyDeckBehavior?: 'shuffle' | 'repeat' | 'stop';
	emptyDeckMessage?: string;
	cards: DeckCard[];
}
