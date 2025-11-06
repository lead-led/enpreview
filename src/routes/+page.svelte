<script lang="ts">
	import { isSettingsOpen } from '$lib/stores';

	import TallyDisplay from '$lib/components/TallyDisplay.svelte';
	import Clock from '$lib/components/Clock.svelte';
	import MessageController from '$lib/components/MessageController.svelte';

	import Settings from '$lib/components/Settings.svelte';

	const handleClick = () => {
		if ($isSettingsOpen) {
			$isSettingsOpen = false;
		} else {
			$isSettingsOpen = true;
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	};
</script>

<MessageController />

<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-no-noninteractive-tabindex -->
<main tabindex="0" on:click={handleClick} on:keydown={handleKeyDown}>
	{#if $isSettingsOpen}
		<Settings />
	{/if}

	<div class="container">
		<Clock />

		<TallyDisplay />
	</div>
</main>

<style>
	main {
		overflow: hidden;
		width: 100vw;
		height: 100vh;
	}

	.container {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-direction: row;
		position: relative;
	}
	:root {
		font-family: 'Overpass', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		color: white;
		user-select: none;
	}

	:global(body) {
		margin: 0;
		padding: 0;
	}

	:global(button:hover) {
		cursor: pointer;
	}
</style>
