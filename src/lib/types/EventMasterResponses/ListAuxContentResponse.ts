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

export interface ListAuxContentResponse {
	jsonrpc: string;
	result: {
		success: number;
		response: {
			id: number;
			Name: string;
			PvwLastSrcIndex: number;
			PgmLastSrcIndex: number;
			OutputCfg: OutputCfg[];
		};
	};
	id: string;
}
