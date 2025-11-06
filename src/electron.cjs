const { ipcMain, app } = require('electron');
const contextMenu = require('electron-context-menu');
const Store = require('electron-store');
const path = require('path');

const { StoreListeners, WindowsManager, BackendService } = require('./main/classes/index.cjs');
const { updater } = require('./main/updater.cjs');

let version;

if (app.isPackaged) {
	version = process.version;
} else {
	console.log('app is not packaged');
	const packagePath = path.join(app.getAppPath(), '..', 'package.json');

	const packageJson = require(packagePath);

	version = packageJson.version;
}

const store = new Store();
const storeListeners = new StoreListeners(store);
storeListeners.mountListeners();

const windowsManager = new WindowsManager();

const service = new BackendService(windowsManager, store);

updater(app.isPackaged, windowsManager);

try {
	require('electron-reloader')(module);
} catch (e) {
	console.error(e);
}

contextMenu({
	showInspectElement: false,
	// showLookUpSelection: false,
	// showSearchWithGoogle: false,
	// showCopyImage: false,
	prepend: (defaultActions, parameters, browserWindow) => [
		{
			label: 'Settings',
			click: () => {
				windowsManager.sendMessageToAllWindows('open-settings');
			},
		},
	],
});

app.once('ready', () => windowsManager.initNewWindow());

app.on('activate', () => {
	windowsManager.initNewWindow();
});

app.on('window-all-closed', () => {
	console.log('window-all-closed');
	if (process.platform !== 'darwin') app.quit();
	if (service.subscriptionServer) {
		console.log('shutting down subscription server');
		service.shutdownSubscriptionServer();
	}
});

app.on('before-quit', async () => {
	console.log('before quit');
	storeListeners.removeListeners();
	if (service.subscriptionServer) {
		await service.requestController.requestUnsubscribe();
		service.shutdownSubscriptionServer();
	}
});

ipcMain.on('new-window', (event, msg) => {
	windowsManager.initNewWindow();
});

ipcMain.on('window-loaded', (event, newId) => {
	windowsManager.handleNewWindowHasLoaded(newId, version, service);
});

ipcMain.on('window-destroyed', (event, id) => {
	console.log('window destroyed');
});

ipcMain.on('connect-e2', (event, msg) => {
	service.setLastIpAddress(msg);
	service.initE2Service();
});

ipcMain.on('set-selected-nic', (event, msg) => {
	service.selectNic(msg);
});

ipcMain.on('disconnect-e2', (event, msg) => {
	service.shutdownSubscriptionServer();
});

ipcMain.on('update-screen-dest-listeners', (event, msg) => {
	console.log(JSON.parse(msg));
});

ipcMain.on('window-destroyed', (event, msg) => {
	console.log('window-destroyed');
});

ipcMain.on('update-screen-destination-listeners', (event, msg) => {
	service.updateScreenDestinationListeners(JSON.parse(msg));
});

ipcMain.on('test-from-frontend', (event, msg) => {
	service.test();
});

ipcMain.on('update-preset-list', (event, msg) => {
	service.updatePresetList();
});
