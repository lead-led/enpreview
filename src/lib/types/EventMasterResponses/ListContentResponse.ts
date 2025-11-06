interface RGBColor {
	id: number;
	Red: number;
	Green: number;
	Blue: number;
}

interface BGItem {
	id: number;
	LastBGSourceIndex: number;
	BGShowMatte: number;
	BGColor: RGBColor;
}

interface Dimension {
	HPos: number;
	VPos: number;
	HSize: number;
	VSize: number;
}

interface Mask {
	id: number;
	Top: number;
	Left: number;
	Right: number;
	Bottom: number;
}

interface Layer {
	id: number;
	Name: string;
	LastSrcIdx: number;
	PvwMode: number;
	PgmMode: number;
	LinkLayerId: number;
	LinkDestId: number;
	Capacity: number;
	PvwZOrder: number;
	PgmZOrder: number;
	Freeze: number;
	ScalingMode: number;
	Window: Dimension[];
	Source: Dimension[];
	Mask: Mask[];
}

interface Transition {
	id: number;
	TransTime: number;
	TransPos: number;
	ArmMode: number;
}

interface TestPattern {
	id: number;
	TestPatternMode: number;
}

interface OutputAOI {
	id: number;
	TestPattern: TestPattern[];
}

interface OutputCfg {
	id: number;
	Name: string;
	OutputAOI: OutputAOI[];
}

export interface ListContentResponse {
	jsonrpc: string;
	result: {
		success: number;
		response: {
			id: number;
			Name: string;
			IsActive: number;
			BGLyr: BGItem[];
			Layers: Layer[];
			Transition: Transition[];
			OutputCfg: OutputCfg[];
		};
	};
	id: string;
}
