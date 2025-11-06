<script lang="ts">
	import {
		isTimeBackground,
		setCurrentComputerTime,
		displayedHours,
		displayedMinutes,
		displayedSeconds,
		clockFontSize,
		isTimeShowing,
	} from '$lib/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	onMount(() => {
		setInterval(() => {
			setCurrentComputerTime();
		}, 1000);
	});
</script>

{#if $isTimeShowing}
	<div
		class="container"
		style={`font-size: ${$clockFontSize}px;`}
		class:background={$isTimeBackground}
		transition:fade={{ duration: 100 }}
	>
		<div class="position-container">
			<div class="actual">{$displayedHours.charAt(0)}</div>
			<div class="placeholder">0</div>
		</div>
		<div class="position-container">
			<div class="actual">{$displayedHours.charAt(1)}</div>
			<div class="placeholder">0</div>
		</div>
		<div class="colon">:</div>
		<div class="position-container">
			<div class="actual">{$displayedMinutes.charAt(0)}</div>
			<div class="placeholder">0</div>
		</div>
		<div class="position-container">
			<div class="actual">{$displayedMinutes.charAt(1)}</div>
			<div class="placeholder">0</div>
		</div>
		<div class="colon">:</div>
		<div class="position-container">
			<div class="actual">{$displayedSeconds.charAt(0)}</div>
			<div class="placeholder">0</div>
		</div>
		<div class="position-container">
			<div class="actual">{$displayedSeconds.charAt(1)}</div>
			<div class="placeholder">0</div>
		</div>
	</div>
{/if}

<style>
	.container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 3em;
		display: flex;
	}

	.position-container {
		padding: 2px;
		position: relative;
		display: flex;
		justify-content: center;
	}
	.placeholder {
		opacity: 0;
	}
	.actual {
		position: absolute;
		display: flex;
		justify-content: center;
	}
	.background {
		background: black;
		padding: 50px;
		padding-top: 15px;
		padding-bottom: 15px;
	}
</style>
