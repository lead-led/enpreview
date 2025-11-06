const { RequestController } = require('./RequestController.cjs');
const { SubscriptionController } = require('./SubscriptionController.cjs');
const { e2State } = require('./e2State.cjs')

const { networkInterfaces } = require('os');
const express = require('express');
const bodyParser = require('body-parser');

class BackendService {
	nics = [];
	subscriptionServerPort = 6788;
	presetList = [];
	selectedNic;
	e2Ip;
	subscriptionServer;
	store;
	windowsManager;
	lastIpAddressThatWasSetByUser = '';
	serverAddress = '';
	requestController;

	constructor(windowsManager, store) {
		this.windowsManager = windowsManager;
		this.store = store;
		this.setNics();
		this.initExpressServer();
		this.requestController = new RequestController(windowsManager, this);
		this.subscriptionController = new SubscriptionController(windowsManager, this);
		this.e2State = new e2State();
	}

	test() {
		console.log('TEST COMMAND RECEIVED FROM FRONTEND')
		console.log('THIS IS PRINTED FROM backendService.cjs test() command')
		this.windowsManager.sendMessageToAllWindows('test-from-backend', JSON.stringify({
			e2: this.e2Ip,
			selectedNic: this.subscriptionServer
		}))
	}

	async updatePresetList() {
		const presetList = await this.requestController.requestListDestPresets();
		this.e2State.setPresetList(presetList)

		this.sendPresetListToFrontend()

	}

	setLastIpAddress(addr) {
		// TODO: need to include some error handling
		this.lastIpAddressThatWasSetByUser = addr;
	}

	selectNic(nicObj) {
		this.serverAddress = nicObj;
	}

	updateScreenDestinationListeners = (params) => {
		console.log('update screen destination listeners');
	};

	findFrame = async () => {
		console.log('find frame');
		if (!this.lastIpAddressThatWasSetByUser) return;

		let isExpectedResponse = await this.requestController.getExpectedResponse(
			`http://${this.lastIpAddressThatWasSetByUser}:9999`,
		);

		if (isExpectedResponse) {
			this.e2Ip = this.lastIpAddressThatWasSetByUser;
		}
	};

	initE2Service = async () => {
		console.log('init e2 service');

		// TODO: shut down and null old server info

		if (!this.lastIpAddressThatWasSetByUser) {
			return;
		}

		// Find Frame, send messages
		await this.findFrame();

		// If Frame
		if (!this.e2Ip) {
			// If not Frame
			// TODO: Notify user that no frame was found
		}

		// Start Subscription Server
		await this.startSubscriptionListener();

		// Get Screen Dest Preset List
		const presetList = await this.requestController.requestListDestPresets();
		this.e2State.setPresetList(presetList)

		this.sendPresetListToFrontend()

		// Subscribe to notifications
		await this.requestController.requestScreenDestinationSubscription();
	};

	sendPresetListToFrontend() {
		const msg = JSON.stringify({
			type: 'preset-list',
			data: this.e2State.getPresetList(),
		});

		this.windowsManager.sendMessageToAllWindows("em-res-msg", msg)
	}

	initExpressServer = () => {
		console.log('init subscription server');
		this.subscriptionServer = express();
		this.subscriptionServer.use(bodyParser.json());

		this.subscriptionServer.post('/', async (req, res) => {
			console.log('message received');
			this.subscriptionController.handleSubscriptionNotification(req);

			res.send('OK');
		});
	};

	startSubscriptionListener = async () => {
		try {
			this.subscriptionServer.listen(this.subscriptionServerPort, this.serverAddress, () => {
				console.log(`Express server started on port ${this.subscriptionServerPort}`);
				console.log('***********************************');
			});
		} catch (error) {
			console.log('port is already in use, trying again');
			this.subscriptionServerPort += this.subscriptionServerPort;
			this.startSubscriptionListener();
		}
	};

	shutdownSubscriptionServer = () => {
		try {
			this.subscriptionServer.close();
		} catch (error) {
			console.log('no server to close');
		}
		this.subscriptionServer = null;
	};

	subscriptionMessageIsAStateChange = (nt) => {
		if (nt === 'ScreenDestChanged') {
			return true;
		}
		return false;
	};

	sendMsgToWindowRefs(channel, msg) {
		if (!this.windowsManager.all.length) return;

		for (const window of this.windowsManager.all) {
			window?.webContents.send(channel, msg);
		}
	}

	setNics() {
		const nets = networkInterfaces();

		function parseObject(obj) {
			const result = [];

			Object.keys(obj).forEach((key) => {
				const addresses = obj[key];

				addresses.forEach((addressObj) => {
					const { address } = addressObj;

					const ipv4AddressRegex =
						/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

					if (ipv4AddressRegex.test(address)) {
						result.push({ nic: key, address });
					}
				});
			});

			return result;
		}

		this.nics = parseObject(nets);

		console.log('this.nics', this.nics);
	}
}

module.exports = { BackendService };
