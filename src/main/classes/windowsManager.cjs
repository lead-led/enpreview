const { ipcMain, BrowserWindow, app } = require('electron');
const windowStateManager = require('electron-window-state');
const path = require('path');
const serve = require('electron-serve');
const http = require('http');

const dev = !app.isPackaged;
// Use a dedicated env var so random global PORT values don't break the dev server lookup.
const port = Number(process.env.VITE_DEV_SERVER_PORT) || 5173;
const serveURL = serve({ directory: '.' });

const waitForDevServer = (port, maxAttempts = 50, delay = 200) =>
	new Promise((resolve, reject) => {
		const attempt = attemptCount => {
			const req = http.get({ host: '127.0.0.1', port, path: '/' }, res => {
				res.resume();
				resolve();
			});

			req.on('error', () => {
				if (attemptCount <= 0) {
					reject(new Error(`Dev server never became ready on port ${port}`));
					return;
				}
				setTimeout(() => attempt(attemptCount - 1), delay);
			});
		};

		attempt(maxAttempts);
	});

class WindowsManager {
	all = [];

	constructor() {}

	handleNewWindowHasLoaded(id, version, service) {
		this.sendMessageToAllWindows('available-nics', service.nics);

		this.sendMessageToAllWindows('version', version);
	
		this.sendMessageToAllWindows('updater-msg', `app is packaged: ${app.isPackaged}`);

		this.updateAllWindowIds()

		service.sendPresetListToFrontend()
	}

	removeWindowById(id) {
		const newArray = this.all.filter(window => window.id != id)
		this.all = newArray
	}

	sendMessageToSingleWindow(windowId, msg) {
		console.log(windowId)
	}

	sendMessageToAllWindows(channel, msg) {
		// console.log(msg);
		if (typeof msg != 'string') {
			msg = JSON.stringify(msg);
		}
		// console.log(msg);

		for (const window of this.all) {
			window.webContents.send(channel, msg);
		}
	}

	updateAllWindowIds() {
		for (const window of this.all) {
			window.webContents.send('window-id', window.id)
		}
	}

	closeAll() {
		for (const window of this.all) {
			window.close();
		}
	}

	deleteListenersOnAllWindows() {}

	initListeners() {
		// ipcMain.on('init-backend-object', (event, msg) => {
		// 	msg = JSON.parse(msg);
		// });

		// ipcMain.on('start-server', (event, msg) => {
		// 	console.log('start local server command received in main process');

		// 	msg = JSON.parse(msg);
		// });

		// ipcMain.on('stop-server', (event, msg) => {
		// 	console.log('stop local server command received in main process');

		// 	msg = JSON.parse(msg);
		// });

		// ipcMain.on('update-screen-dest-listeners', (event, msg) => {
		// 	console.log('update screen destination listeners');
		// });
	}

	initNewWindow() {
		console.log('init new window');
		let newWindow = this.createNewWindowObject();
		this.all.push(newWindow);

		if (dev) {
			waitForDevServer(port)
				.then(() => {
					this.loadVite(port, newWindow);
					newWindow.webContents.openDevTools();
				})
				.catch((err) => {
					console.error('Vite dev server never became ready:', err);
				});
		} else {
			serveURL(newWindow);
		}

		newWindow.once('ready-to-show', () => {
			if (!newWindow) return;

			newWindow.removeMenu();
			newWindow.show();
			newWindow.focus();
		});
	}

	createNewWindowObject() {
		console.log('creating new window object');
		let windowState = windowStateManager({
			defaultWidth: 400,
			defaultHeight: 600,
		});

		const window = new BrowserWindow({
			backgroundColor: '#202020',
			webPreferences: {
				contextIsolation: true,
				nodeIntegration: true,
				spellcheck: false,
				devTools: true,
				preload: path.join(__dirname, '../../preload.cjs'),
			},
			x: windowState.x + this.all.length * 25,
			y: windowState.y + this.all.length * 25,
			width: windowState.width,
			height: windowState.height,
		});

		windowState.manage(window);

		window.on('close', () => {
			windowState.saveState(window);
			this.removeWindowById(window.id);
		});

		return window;
	}

	loadVite(port, window) {
		window.loadURL(`http://localhost:${port}`).catch((e) => {
			console.error('Error loading dev server URL', e);
		});
	}
}

module.exports = { WindowsManager };
