import { writable, get, type Writable } from 'svelte/store';
import type {
	AuxDestinationLayer,
	ElectronMessageType,
	ListAuxContentResponse,
	ListContentResponse,
	ListPresetResponse,
	Preset,
	ScreenDestination,
	ScreenDestinationLayer,
} from '../types';

export const inPgm: Writable<ListPresetResponse> = writable({
	id: -1000,
	Name: "Program",
	presetSno: -1000,
	LockMode: 0
});
export const inPvw: Writable<ListPresetResponse> = writable(
	{
		id: -1000,
		Name: "Preview",
		presetSno: -1000,
		LockMode: 0
	}
);

let listeningToLastPreviewedPreset = false

export const isConnected = writable(false)
export const setIsConnected = (newConnectionStatus: boolean) => {
	isConnected.set(newConnectionStatus)
}

export const presetList: Writable<Preset[]> = writable([]);
export const updatePresetList = (newList: Preset[]) => {
	if (!newList) return
	presetList.set(
		newList.map((item) => {
			return {
				...item,
				isChecked: true,
			};
		}),
	);
};

export const screenDestinationList: Writable<ScreenDestination[]> = writable([]);

export const setscreenDestinationList = (newList: ScreenDestination[]) => {
	newList.map((item) => {
		item.isChecked = true;
	});
	screenDestinationList.set(newList);

	// TODO: init backend screen destination indexees
};
export const updatescreenDestinationList = (newList: ScreenDestination[]) => {
	screenDestinationList.set(newList);
};


export const handleResponseMessage = (msg: any) => {
	msg = JSON.parse(msg);

	const type: ElectronMessageType = msg.type;

	if (type === 'preset-list') {
		updatePresetList(msg.data);
	}

	if (type === 'screen-destination-list') {
		// setscreenDestinationList(msg.data.ScreenDestination);
	}
};

export const handleSubscriptionMessage = (msg: any) => {

	msg = JSON.parse(msg);

	if (msg.messageType == 'preset-changed') {
		handlePresetChanged(msg);
	}

	if (msg.messageType == 'screen-dest-changed') {
		handleScreenDestChanged(msg);
	}

	if (msg.messageType == 'aux-dest-changed') {
		handleAuxDestChanged(msg);
	}
};

const handleScreenDestChanged = (msg: any) => {
	if (atleastOneScreenDestDidCut(msg.newScreenDestStates)) {
		updateScreenPgmState();
	}
};

const handleAuxDestChanged = (msg: any) => {
	console.log(msg)
	if (atleastOneAuxDestDidCut(msg.newAuxDestStates)) {
		// updateAuxPgmState();
		// TODO: wtf is this now???
	}
	if (atleastOneScreenDestDidCut(msg.newScreenDestStates)) {
		updateScreenPgmState();
	}

};

const atleastOneAuxDestDidCut = (auxStates: ListAuxContentResponse[]) => {
	let didCut = false;
	for (const state of auxStates) {
		if (!didCut) {
			didCut = auxDestDidCut(state, +state.id);
		}

		if (didCut) {
			return didCut;
		}
	}

	return didCut;
};

const atleastOneScreenDestDidCut = (screenStates: ListContentResponse[]) => {
	let didCut = false;
	if (!screenStates) return
	
	for (const state of screenStates) {
		if (!didCut) {
			didCut = screenDestDidCut(state, +state.id);
		}
	}
	return didCut;
};

const compareAuxDestLayers = (
	oldLayers: AuxDestinationLayer[],
	newLayers: AuxDestinationLayer[],
) => {
	let hasChanged = false;

	for (const oldLayer of oldLayers) {
		// get layer
		const newLayer = newLayers.find((l) => l.Name == oldLayer.Name);

		if (!newLayer) {
			return hasChanged;
		}

		// TODO, fix this
		// if (newLayer.PgmMode != oldLayer.PgmMode && newLayer.PvwMode != oldLayer.PvwMode) {
		// 	return true;
		// }
	}

	return hasChanged;
};

const auxDestDidCut = (state: any, auxIndex: number): boolean => {
	let shouldUpdate = false;

	// get the old aux destination state
	const oldDestination = get(screenDestinationList).find((d) => d.id === auxIndex);

	if (!oldDestination) {
		return shouldUpdate;
	}

	if (oldDestination.Layers.length) {
		shouldUpdate = compareAuxDestLayers(oldDestination.Layers, state.Layers);
	}

	oldDestination.Layers = state.Layers;

	return shouldUpdate;
};

const screenDestDidCut = (state: any, destinationIndex: number): boolean => {
	let shouldUpdate = false;

	// get the old destination state

	const oldDestination = get(screenDestinationList)?.find((d) => d.id === destinationIndex);

	if (!oldDestination) {
		get(screenDestinationList).push(state)
		return shouldUpdate;
	}

	if (oldDestination.Layers.length) {
		shouldUpdate = compareScreenDestLayers(oldDestination.Layers, state.Layers);
	}

	oldDestination.Layers = state.Layers;

	if (!listeningToLastPreviewedPreset) {
		shouldUpdate = false
	}

	return shouldUpdate;
};

const compareScreenDestLayers = (
	oldLayers: ScreenDestinationLayer[],
	newLayers: ScreenDestinationLayer[],
) => {
	let hasChanged = false;

	for (const oldLayer of oldLayers) {
		// get layer
		const newLayer = newLayers.find((l) => l.Name == oldLayer.Name);

		if (!newLayer) {
			return hasChanged;
		}

		if (newLayer.PgmMode != oldLayer.PgmMode && newLayer.PvwMode != oldLayer.PvwMode) {
			return true;
		}
	}

	return hasChanged;
};

const updateScreenPgmState = () => {
	inPgm.set(get(inPvw));
};

const handlePresetChanged = (msg: any) => {
	if (shouldUpdate(msg.newPreset)) {
		listeningToLastPreviewedPreset = true
		updateScreenPreview(msg);
	} else {
		listeningToLastPreviewedPreset = false
	}
};

// This functions checks if the user wants to listen to this preset
const shouldUpdate = (presetNumber: number): boolean => {
	let shouldUpdate = false;

	const preset = get(presetList).find((p) => p.id === presetNumber);

	if (preset?.isChecked) {
		shouldUpdate = true;
	}

	return shouldUpdate;
};

const updateScreenPreview = (msg: any) => {
	const newPreset = get(presetList).find((preset) => preset.id === msg.newPreset);

	newPreset && inPvw.set(newPreset)
};
