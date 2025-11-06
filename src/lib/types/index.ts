export * from './EventMasterResponses';

export interface LayerState {
	name: string;
	timeRemaining: number;
	totalTime: number;
	times: {
		frames: string;
		seconds: string;
		minutes: string;
		hours: string;
	};
	isVisible: boolean;
}

export interface Preset {
	id: number;
	Name: string;
	presetSno: number;
	LockMode: number;
	isChecked: boolean;
}
export interface ScreenDestination {
	id: number;
	Name: string;
	HSize: number;
	VSize: number;
	Layers: ScreenDestinationLayer[];
	DestOutMapCol?: {
		DestOutMap: DestinationOutput[];
	};
	isChecked: boolean;
}

export interface ScreenDestinationLayer {
	id: number;
	PgmMode: number;
	PvwMode: number;
	Name: string;
}

export interface AuxDestinationLayer {
	id: number;
	Name: string;
}

export interface DestinationOutput {
	id: number;
	Name: string;
	HPos: number;
	VPos: number;
	HSize: number;
	VSize: number;
	FrzMode: number;
}

export type ElectronMessageType =
	| 'screen-destination-list'
	| 'aux-destination-list'
	| 'preset-list'
	| 'aux-preset-list';

export type SubscriptionNotificationType = 'ScreenDestChanged' | 'AUXDestChanged' | 'PresetChanged';

export interface LocalLayerState {
	id: string;
	preview: any;
	program: any;
}
