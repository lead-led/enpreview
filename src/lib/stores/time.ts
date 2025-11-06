import { writable, get } from 'svelte/store';

export const displayedTime = writable('12:00:00');
export const isTimeBackground = writable(true);
export const currentComputerTime = writable('12:00:00');
export const adjustedSeconds = writable(0);
export const adjustedMinutes = writable(0);
export const adjustedHours = writable(0);
export const displayedHours = writable('00');
export const displayedMinutes = writable('00');
export const displayedSeconds = writable('00');

export function setCurrentComputerTime() {
	updateDisplayedHours();
	updateDisplayedMinutes();
	updateDisplayedSeconds();
}

export function updateDisplayedHours() {
	const now = new Date();
	const hours = now.getHours();
	const newHours = hours + get(adjustedHours);
	displayedHours.set(newHours.toString());
	if (get(displayedHours).length < 2) {
		displayedHours.set(`0${newHours}`);
	}
}

export function updateDisplayedMinutes() {
	const now = new Date();
	const minutes = now.getMinutes();
	const newMinutes = minutes + get(adjustedMinutes);
	displayedMinutes.set(newMinutes.toString());
	if (get(displayedMinutes).length === 1) {
		displayedMinutes.set(`0${newMinutes}`);
	}
}

export function updateDisplayedSeconds() {
	const now = new Date();
	const seconds = now.getSeconds();
	const newSeconds = seconds + get(adjustedSeconds);
	displayedSeconds.set(newSeconds.toString());
	if (get(displayedSeconds).length === 1) {
		displayedSeconds.set(`0${newSeconds}`);
	}
}
