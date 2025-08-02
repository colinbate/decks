<script lang="ts">
	import type { Deck, DeckCard } from '$lib/types';
	import SvgText from './svg-text.svelte';

	let {
		card,
		deckConfig,
		isBack = false,
		isModal = false,
		isPortrait = false,
		onclick,
	}: {
		card: DeckCard;
		deckConfig: Deck;
		isBack?: boolean;
		isModal?: boolean;
		isPortrait?: boolean;
		onclick?: (ev: MouseEvent) => void;
	} = $props();

	function getBackgroundStyle(side: 'back' | 'front'): string {
		if (side === 'back') {
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
</script>

<button
	{onclick}
	id={card.id}
	class={[
		'card absolute box-content aspect-[5/7] max-h-[calc(100%_-_2rem)] max-w-[calc(100%_-_2rem)] transition-transform duration-500 perspective-normal transform-3d',
		onclick && 'cursor-pointer',
		isModal && 'modal',
		card.moving ? 'moving' : '',
		!isBack && 'rotate-y-180',
		isPortrait ? 'h-full w-auto' : 'h-auto w-full',
	]}
>
	<!-- Back -->
	<div
		class={[
			'card-face bg-muted absolute inset-0 flex items-center justify-center rounded-xl border-2 border-slate-800 shadow-lg backface-hidden',
		]}
		style={getBackgroundStyle('back')}
	></div>
	<!-- Front -->
	{#if !card.moving}
		<div
			class="card-face bg-muted absolute inset-0 flex rotate-y-180 items-center justify-center rounded-xl border-2 border-slate-800 shadow-lg backface-hidden"
			style={getBackgroundStyle('front')}
		>
			{#if card.text}
				<div
					class="card-text flex h-full max-w-[90%] items-center justify-center p-4 text-center leading-tight font-bold break-words hyphens-auto text-slate-800 select-none"
					style="text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);"
				>
					<SvgText text={card.text} />
				</div>
			{/if}
		</div>
	{/if}
</button>

<style>
	.card.moving {
		view-transition-name: moving;
	}
	.card-face {
		background-size: cover !important;
		background-position: center !important;
		background-repeat: no-repeat !important;
	}

	.card.modal {
		width: 15.625rem; /* 250px */
		height: 21.875rem; /* 350px */
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
	}
</style>
