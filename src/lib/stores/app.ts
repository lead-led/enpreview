import { writable } from 'svelte/store';

export const isSettingsOpen = writable(true);
export const textAlignment = writable('left');
export const isTextOnTop = writable(true);
export const labelFontSize = writable(50);
export const timeFontSize = writable(100);
export const isEditingFormat = writable(false);
export const showName = writable(true);
export const showNumber = writable(true);


export const isTimeShowing = writable(true);
export const clockFontSize = writable(82);

export const tallyFontSize = writable(82);

export const accordians = writable({
	connectivity: false,
	display: false,
	tallyFormat: false,
	clockFormat: false,
	presetList: false,
});

export const version = writable('0.0.0');

export const windowId = writable('')