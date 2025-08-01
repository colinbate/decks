export function shuffleArray<T>(array: T[]) {
	for (let i = array.length - 1; i >= 1; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
