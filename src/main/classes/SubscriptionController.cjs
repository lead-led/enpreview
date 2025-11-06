class SubscriptionController {
	constructor(windowsManager, service) {
		this.windowsManager = windowsManager;
		this.service = service;
	}

	handleSubscriptionNotification = async (req) => {
		const { body } = req;
		
		if (!body?.result) return;
		
		const nt = body.result.notificationType;

		console.log('');
		console.log('');
		console.log('');
		console.log('');
		console.log('');
		console.log('subscription message');
		console.log('notification type, ', nt)
		console.log(new Date());

		if (nt === 'ScreenDestChanged') {
			// console.log('message is ScreenDestChanged');
			this.handleScreenDestChanged(body);
		}

		if (nt === 'PresetChanged') {
			// console.log('message is PresetChanged');
			this.handlePresetChanged(body);
		}

		if (nt === 'AUXDestChanged') {
			// console.log('message is AUXDestChanged');
			this.handleAUXDestChanged(body);

		}
	};

	handleAUXDestChanged = async (body) => {
		// get screen indexes
		const auxIndexes = body.result?.change?.update;

		// return if no indexes
		if (!auxIndexes.length) {
			return;
		}

		// get new states for each index
		const auxStates = await this.getNewAuxStates(auxIndexes);

		// send new states to frontend
		const msg = {
			messageType: 'aux-dest-changed',
			newAuxDestStates: auxStates,
		};

		this.sendMsgToWindowRefs(JSON.stringify(msg));
	};

	getNewAuxStates = async (auxIndexes) => {
		const newStates = [];

		for (const auxIndex of auxIndexes) {
			const res = await this.service.requestController.requestAuxDestinationContent(auxIndex);
			newStates.push(res);
		}

		return newStates;
	};

	getNewScreenDestStates = async (screenIndexes) => {
		const newStates = [];

		for (const screenIndex of screenIndexes) {
			const res = await this.service.requestController.requestScreenDestinationContent(
				screenIndex,
			);
			newStates.push(res);
		}

		return newStates;
	};

	handleScreenDestChanged = async (body) => {
		// get screen indexes
		const screenIndexes = body.result?.change?.update;

		// return if no indexes
		if (!screenIndexes.length) {
			return;
		}

		// get new states for each index
		const screenStates = await this.getNewScreenDestStates(screenIndexes);

		// send new states to frontend
		const msg = {
			messageType: 'screen-dest-changed',
			newScreenDestStates: screenStates,
		};

		this.sendMsgToWindowRefs(JSON.stringify(msg));
	};

	handlePresetChanged = async (body) => {
		// Which preset
		const presetNumber = body.result.change.update[0];

		console.log(presetNumber, ' NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW');

		// create msg with body and destinationIndexes
		const msg = {
			messageType: 'preset-changed',
			newPreset: presetNumber,
		};

		// send message
		this.sendMsgToWindowRefs(JSON.stringify(msg));
	};

	sendMsgToWindowRefs(msg) {
		if (!this.windowsManager.all.length) return;

		for (const window of this.windowsManager.all) {
			window?.webContents.send('em-sub-msg', msg);
		}
	}

	subscriptionMessageIsAStateChange = (nt) => {
		if (nt === 'ScreenDestChanged') {
			return true;
		}
		return false;
	};
}

module.exports = { SubscriptionController };
