<script lang="ts">
	import { browser } from '$app/environment';

	import {
		isSettingsOpen,
		setIps,
		version,
		handleResponseMessage,
		handleSubscriptionMessage,
		windowId,
	} from '$lib/stores';

	import { onDestroy, onMount } from 'svelte';

	if (window.electron && browser)  {
		window.electron.receive('local-server-status', (data: any) => {});

		window.electron.receive('available-nics', (data: any) => {
			data = JSON.parse(data);
			setIps(data);
		});
		window.electron.receive('open-settings', (data: any) => {
			$isSettingsOpen = true;
		});
		window.electron.receive('updater-msg', (data: any) => {
			console.log(data);
		});
		window.electron.receive('version', (data: any) => {
			$version = data;
			if (document?.querySelector('head title')) {
				// @ts-ignore
				document.querySelector('head title').innerText += ` v${data}`;
			}
		});
		window.electron.receive('em-res-msg', (msg: any) => {
			handleResponseMessage(msg);
		});
		window.electron.receive('em-sub-msg', (msg: any) => {
			handleSubscriptionMessage(msg);
		});
		window.electron.receive('e2-msg', (msg: any) => {
			console.log(msg);
		});
		window.electron.receive('test-from-backend', (msg: any) => {
			console.log('TEST COMMAND RECEIVED FROM BACKEND');
			console.log(JSON.parse(msg));
		});
		window.electron.receive('window-id', (msg: any) => {
			console.log('id ', msg);
			$windowId = msg;
		});
	}

	onMount(() => {
		window.electron.send('window-loaded', true);
	});
	onDestroy(() => {
		window.electron.send('window-destroyed', $windowId);
	});
</script>
