<script lang="ts">
	interface DeckCard {
		text: string;
		frontImage?: string;
		backImage?: string;
		frontColor?: string;
		backColor?: string;
	}

	interface DeckConfig {
		defaultBackColor?: string;
		defaultFrontColor?: string;
		defaultBackImage?: string;
		defaultFrontImage?: string;
	}

	let {
		card,
		deckConfig,
		isBack = false,
		isClickable = false,
		isModal = false,
	}: {
		card: DeckCard;
		deckConfig: DeckConfig;
		isBack?: boolean;
		isClickable?: boolean;
		isModal?: boolean;
	} = $props();

	function getBackgroundStyle(isCardBack: boolean): string {
		if (isCardBack) {
			// Back of card
			if (card.backImage) {
				return `background-image: url(${card.backImage});`;
			}
			if (deckConfig.defaultBackImage) {
				return `background-image: url(${deckConfig.defaultBackImage});`;
			}
			if (card.backColor) {
				return `background: ${card.backColor};`;
			}
			if (deckConfig.defaultBackColor) {
				return `background: ${deckConfig.defaultBackColor};`;
			}
			// Default app back
			return `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`;
		} else {
			// Front of card
			if (card.frontImage) {
				return `background-image: url(${card.frontImage}); background-size: cover; background-position: center;`;
			}
			if (deckConfig.defaultFrontImage) {
				return `background-image: url(${deckConfig.defaultFrontImage}); background-size: cover; background-position: center;`;
			}
			if (card.frontColor) {
				return `background: ${card.frontColor};`;
			}
			if (deckConfig.defaultFrontColor) {
				return `background: ${deckConfig.defaultFrontColor};`;
			}
			// Default app front
			return `background: #ffffff;`;
		}
	}

	function getFontSize(text: string): string {
		if (!text) return '1rem';

		const length = text.length;
		if (length <= 2) return isModal ? '3rem' : '2rem';
		if (length <= 5) return isModal ? '2rem' : '1.5rem';
		if (length <= 10) return isModal ? '1.5rem' : '1.2rem';
		return isModal ? '1.2rem' : '1rem';
	}
</script>

<div
	class="card relative flex h-70 w-50 items-center justify-center rounded-xl border-2 border-slate-800 shadow-lg transition-all duration-300 select-none {isClickable
		? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl'
		: ''} {isModal ? 'modal' : ''}"
	style={getBackgroundStyle(isBack)}
>
	{#if !isBack && card.text}
		<div
			class="card-text flex h-full max-w-[90%] items-center justify-center p-4 text-center leading-tight font-bold break-words hyphens-auto text-slate-800"
			style="font-size: {getFontSize(
				card.text
			)}; text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);"
		>
			{card.text}
		</div>
	{/if}
</div>

<style>
	.card {
		background-size: cover !important;
		background-position: center !important;
		background-repeat: no-repeat !important;
	}

	.card.modal {
		width: 15.625rem; /* 250px */
		height: 21.875rem; /* 350px */
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
	}

	/* Responsive sizing for mobile */
	@media (max-width: 768px) {
		.card {
			width: min(200px, 40vw);
			height: min(280px, 56vw);
		}

		.card.modal {
			width: min(280px, 70vw);
			height: min(392px, 98vw);
		}
	}

	@media (max-width: 480px) {
		.card {
			width: min(180px, 42vw);
			height: min(252px, 58.8vw);
		}

		.card.modal {
			width: min(250px, 75vw);
			height: min(350px, 105vw);
		}
	}
</style>
