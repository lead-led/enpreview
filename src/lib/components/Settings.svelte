<script>
	import { fly } from 'svelte/transition';

	import {
		ips,
		isEditingFormat,
		isTimeShowing,
		clockFontSize,
		tallyFontSize,
		accordians,
		adjustedHours,
		adjustedMinutes,
		adjustedSeconds,
		isTimeBackground,
		updateDisplayedHours,
		updateDisplayedMinutes,
		updateDisplayedSeconds,
		presetList,
		isConnected,
		windowId,
		showNumber,
		showName,
	} from '$lib/stores';

	import {
		Button,
		Tile,
		Checkbox,
		Select,
		SelectItem,
		TextInput,
		Slider,
		Accordion,
		AccordionItem,
		Toggle,
	} from 'carbon-components-svelte';

	const handleClick = (event) => {
		event.stopPropagation();
	};

	const handleKeyDown = (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.stopPropagation();
		}
	};

	const handleCheckClick = (e, preset) => {
		preset.isChecked = e.target.checked;
		$presetList = [...$presetList];
	};

	const newWindow = () => {
		window.electron.send('new-window', true);
	};

	const connectToE2 = () => {
		window.electron.send('set-selected-nic', selectedNic);
		window.electron.send('connect-e2', value);
	};

	const disconnect = () => {
		window.electron.send('disconnect-e2', value);
	};

	const handleSelect = (e) => {
		let array = e.target.value.split('.');
		value = array[0] + '.' + array[1] + '.' + array[2] + '.175';
		selectedNic = e.target.value;
	};

	const checkAllPresets = (boolean) => {
		for (const preset of $presetList) {
			preset.isChecked = boolean;
		}
		$presetList = [...$presetList];
	};

	const updatePresetList = () => {
		window.electron.send('update-preset-list');
	};

	const sendTestCommandToBackend = (e) => {
		window.electron.send('test-from-frontend');
	};

	let value = '';
	let selectedNic = '';
	let asdf;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="settings-panel"
	on:click={handleClick}
	on:keydown={handleKeyDown}
	transition:fly={{ x: -100, duration: 200 }}
	class:isEditingFormat={$isEditingFormat}
>
	<div class="scroll-container">
		<div class="spacer"></div>

		<Tile>
			<Button size="small" on:click={newWindow}>Add Window</Button>
		</Tile>

		<!-- <Tile>
			<Button size="small" on:click={sendTestCommandToBackend}>Test</Button>
		</Tile> -->

		<div class="spacer"></div>
		<div class="spacer"></div>

		<Accordion>
			<!-- Connectivity -->
			<!-- Connectivity -->
			<!-- Connectivity -->
			<AccordionItem title="Connectivity" bind:open={$accordians.connectivity}>
				<Select on:change={handleSelect} labelText="Select NIC" bind:asdf>
					{#each $ips as ip}
						<SelectItem value={ip.address} text={`${ip.nic} : ${ip.address}`} />
					{/each}
				</Select>

				<div class="spacer"></div>
				<div class="spacer"></div>

				<TextInput
					labelText="Frame IP Address"
					placeholder="Enter the e2's ip Address..."
					bind:value
				/>

				<div class="spacer"></div>
				<div class="spacer"></div>

				<Button class="asdf" size="small" on:click={connectToE2} disabled={!value}>
					Connect
				</Button>

				<div class="spacer"></div>

				<Button class="asdf" size="small" on:click={disconnect} disabled={!$isConnected}>
					Shutdown
				</Button>
			</AccordionItem>

			<!-- Preset List -->
			<!-- Preset List -->
			<!-- Preset List -->
			<AccordionItem title="Preset List" bind:open={$accordians.presetList}>
				<div class="spacer"></div>
				<Button size="small" on:click={() => checkAllPresets(true)}>Select All</Button>
				<div class="spacer"></div>
				<Button size="small" on:click={() => checkAllPresets(false)}>Select None</Button>
				<div class="spacer"></div>
				<Button size="small" on:click={updatePresetList}>Update List</Button>
				<div class="spacer"></div>

				{#each $presetList as preset}
					<Checkbox
						labelText={`${preset.id} : ${preset.Name}`}
						bind:checked={preset.isChecked}
						on:change={(e) => {
							handleCheckClick(e, preset);
						}}
					/>
				{/each}
			</AccordionItem>

			<!-- Tally Format -->
			<!-- Tally Format -->
			<!-- Tally Format -->
			<AccordionItem title="Text Format" bind:open={$accordians.tallyFormat}>
				<Checkbox labelText="Show Number" bind:checked={$showNumber} />
				<Checkbox labelText="Show name" bind:checked={$showName} />

				<div class="spacer"></div>

				<Slider labelText="Font Size" bind:value={$tallyFontSize} max={350} />
			</AccordionItem>

			<!-- Clock Format -->
			<!-- Clock Format -->
			<!-- Clock Format -->
			<AccordionItem title="Clock Format" bind:open={$accordians.clockFormat}>
				<Checkbox labelText="Show Clock" bind:checked={$isTimeShowing} />
				<Checkbox labelText="Show Background" bind:checked={$isTimeBackground} />

				<div class="spacer"></div>

				<div class="slider-container">
					<Slider labelText="Font Size" bind:value={$clockFontSize} max={350} />
				</div>

				<div class="spacer"></div>

				<div class="adjustment-container">
					<button
						on:click={() => {
							$adjustedHours += -1;
							updateDisplayedHours();
						}}
					>
						-
					</button>
					<!-- <div class="label">H</div> -->
					<button
						on:click={() => {
							$adjustedHours += 1;
							updateDisplayedHours();
						}}
					>
						+
					</button>

					<button
						on:click={() => {
							$adjustedMinutes += -1;
							updateDisplayedMinutes();
						}}
					>
						-
					</button>
					<!-- <div class="label">M</div> -->
					<button
						on:click={() => {
							$adjustedMinutes += 1;
							updateDisplayedMinutes();
						}}
					>
						+
					</button>

					<button
						on:click={() => {
							$adjustedSeconds += -1;
							updateDisplayedSeconds();
						}}
					>
						-
					</button>
					<!-- <div class="label">S</div> -->
					<button
						on:click={() => {
							$adjustedSeconds += 1;
							updateDisplayedSeconds();
						}}
					>
						+
					</button>
				</div>
			</AccordionItem>
		</Accordion>
	</div>
</div>

<style>
	.slider-container {
		width: 100%;
	}

	.adjustment-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
		width: 100%;
	}
	.spacer {
		height: 10px;
	}

	.settings-panel {
		position: absolute;
		height: 100vh;
		background: rgb(44, 44, 44);
		display: flex;
		flex-direction: column;
		min-width: 400px;
		padding-inline: 15px;
		font-family: 'Overpass';
		z-index: 2;
		overflow: scroll;
		transition: opacity 0.3s ease-in-out;
	}

	.settings-panel.isEditingFormat {
		cursor: default;
	}
</style>
