<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import '@fontsource/overpass/200.css';
	import 'carbon-components-svelte/css/g90.css';

	let ready: boolean = false;
	onMount(() => (ready = true));
</script>

<main>
	{#if ready}
		<slot />
	{/if}
</main>

<style>
	main {
		overflow: hidden;
		font-family: Overpass;
	}
</style>
