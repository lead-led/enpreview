class RequestController {
	timeout = 5000;

	constructor(windowManager, service) {
		this.windowsManager = windowManager;
		this.service = service;
	}

	/// OPTIONS ///
	/// OPTIONS ///
	/// OPTIONS ///
	screenDestinationSubscriptionOptions() {
		return {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				params: {
					hostname: this.service.serverAddress,
					port: this.service.subscriptionServerPort,
					notification: ['PresetChanged', 'ScreenDestChanged', 'AUXDestChanged'],
				},
				method: 'subscribe',
				id: '4',
				jsonrpc: '2.0',
				timeout: this.timeout,
			}),
		};
	}

	unSubscriptionOptions() {
		return {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				params: {
					hostname: this.service.serverAddress,
					port: this.service.subscriptionServerPort,
					notification: [
						'ScreenDestChanged',
						'AUXDestChanged',
						'FrameChanged',
						'NativeRateChanged',
						'InputCfgChanged',
						'SourceChanged',
						'BGSourceChanged',
						'PresetChanged',
						'StillChanged',
						'OutputCfgChanged',
					],
				},
				method: 'unsubscribe',
				id: '6',
				jsonrpc: '2.0',
				timeout: this.timeout,
			}),
		};
	}

	listDestPresetsOptions() {
		return {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				params: {
					ScreenDest: -1,
					AuxDest: -1
				},
				method: 'listPresets',
				id: '1234',
				jsonrpc: '2.0',
			}),
			timeout: this.timeout,
		};
	}

	screenDestinationListOptions() {
		return {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				params: {
					type: 1,
				},
				method: 'listDestinations',
				id: '1',
				jsonrpc: '2.0',
			}),
			timeout: this.timeout,
		};
	}

	powerStatusOptions() {
		return {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				params: {},
				method: 'powerStatus',
				id: '10',
				jsonrpc: '2.0',
			}),
			// signal,
			timeout: 50,
		};
	}

	screenDestinationStateOptions(index) {
		return {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				params: {
					id: index,
				},
				method: 'listContent',
				id: '7',
				jsonrpc: '2.0',
				timeout: this.timeout,
			}),
		};
	}

	destinationsForPresetOptions(presetId) {
		return {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				params: {
					id: presetId,
				},
				method: 'listDestinationsForPreset',
				id: '8',
				jsonrpc: '2.0',
				timeout: this.timeout,
			}),
		};
	}

	/// SETTERS ///
	/// SETTERS ///
	/// SETTERS ///
	async setPresetList() {
		// console.log('set preset list');
		const newList = await this.requestListDestPresets();

		return newList
		// if (!newList) {
		// 	return;
		// }

		// const msg = JSON.stringify({
		// 	type: 'preset-list',
		// 	data: newList,
		// });

		// this.sendMsgToWindowRefs(msg);
	}

	async setScreenDestinationList() {
		const newList = await this.requestScreenDestinationList();

		if (!newList) {
			console.error('screen destination list request failed');
			return;
		}

		const msg = JSON.stringify({
			type: 'screen-destination-list',
			data: newList,
		});

		this.sendMsgToWindowRefs(msg);
	}

	async setScreenDestinationContent(index) {
		const newContent = await this.requestScreenDestinationContent(index);

		if (!newContent) {
			console.error('screen destination state request failed');
			return;
		}

		const msg = JSON.stringify({
			type: 'screen-destination-content',
			data: newContent,
		});

		this.sendMsgToWindowRefs(msg);
	}

	/// GETTERS ///
	/// GETTERS ///
	/// GETTERS ///

	async getExpectedResponse(url) {
		const isE2 = await this.requestPowerStatus(url);

		if (!isE2) {
			console.error('power status request failed');
			return false;
		}

		return true;
	}

	/// REQUESTS ///
	/// REQUESTS ///
	/// REQUESTS ///

	async requestDestinationsForPreset(index) {
		if (!this.systemIsReady()) return;

		const options = this.destinationsForPresetOptions(index);

		const resBody = await this.sendRequest(options);

		if (resBody.result.success === 0) {
			return resBody.result.response;
		} else {
			console.error('screen destination state request');

			return false;
		}

		// RESPONSE
		// RESPONSE
		// {
		//		id: 2,
		//		Name: 'Preset 3.00',
		//		LockMode: 0,
		//		presetSno: 3,
		//		ScreenDest: [ { id: 2 }, { id: 3 } ],
		//		AuxDest: []
		// }
	}

	async requestScreenDestinationContent(index) {
		if (!this.systemIsReady()) return;

		const options = this.screenDestinationStateOptions(index);

		const resBody = await this.sendRequest(options);

		if (resBody.result.success === 0) {
			return resBody.result.response;
		} else {
			console.error('screen destination state request');

			return false;
		}
	}

	async requestListDestPresets() {
		if (!this.systemIsReady()) return;

		const options = this.listDestPresetsOptions();

		const resBody = await this.sendRequest(options);

		if (resBody.result?.success === 0) {
			return resBody.result.response;
		} else {
			console.error('list presets request error');

			return false;
		}
	}

	async requestScreenDestinationList() {
		if (!this.systemIsReady()) return;

		const options = this.screenDestinationListOptions();

		const resBody = await this.sendRequest(options);

		if (resBody.result.success === 0) {
			return resBody.result.response;
		} else {
			console.error('screen destination list request failed');

			return false;
		}
	}

	async requestScreenDestinationSubscription() {
		if (!this.systemIsReady()) return;

		const options = this.screenDestinationSubscriptionOptions();

		const resBody = await this.sendRequest(options);

		if (resBody.result.success === 0) {
			console.log('subscription request sucessfull');
			// TODO: should I do this?
			// this.sendMsgToWindowRefs(JSON.stringify(true));

			return true;
		} else {
			console.error('screen subscription request failed');

			return false;
		}
	}

	async requestUnsubscribe() {
		if (!this.systemIsReady()) return;

		const options = this.unSubscriptionOptions();

		const resBody = await this.sendRequest(options);

		if (resBody.result.success === 0) {
			console.log('unsubscribed successfully');
			return true;
		} else {
			console.error('unsubscribed failed');
			return false;
		}
	}

	async requestPowerStatus(url) {
		if (!this.systemIsReady()) return;

		const options = this.powerStatusOptions();

		const resBody = await this.sendRequest(options, url);

		if (resBody?.result?.success === 0) {
			console.log('power status request succeeded');
			return true;
		} else {
			console.error('power status request failed');
			return false;
		}
	}

	/// HELPERS ///
	/// HELPERS ///
	/// HELPERS ///
	async sendRequest(options, url) {
		if (!url) url = this.url();

		try {
			const res = await fetch(url, options);
			const body = await res.json();

			return body;
		} catch (error) {
			console.error({ ...error });
			return error;
		}
	}

	sendMsgToWindowRefs(msg) {
		if (!this.windowsManager.all.length) return;

		for (const window of this.windowsManager.all) {
			window?.webContents.send('em-res-msg', msg);
		}
	}

	url() {
		return `http://${this.service.e2Ip}:9999`;
	}

	systemIsReady() {
		console.log('checking if system is ready');
		if (
			!this.service.subscriptionServer ||
			!this.service.subscriptionServerPort ||
			!this.service.serverAddress
		) {
			console.error('system is not ready');
			return false;
		}

		console.log('system is ready');
		return true;
	}
}

module.exports = { RequestController };
