const { app } = require('electron');
const { autoUpdater } = require('electron-updater');

function updater(isProd, windows) {
	console.log('updater');

	setTimeout(() => {
		windows.sendMessageToAllWindows('updater-msg', 'updater function runs');
	}, 5000);

	if (!isProd) {
		console.log('is development, returning .....');
		return;
	}

	setTimeout(() => {
		windows.sendMessageToAllWindows('updater-msg', 'updater function runs');
	}, 5000);

	console.log('is production, proceeding .....');

	windows.sendMessageToAllWindows('updater-msg', 'updater function passes check');

	autoUpdater.checkForUpdates();

	autoUpdater.on('checking-for-update', () => {
		windows.sendMessageToAllWindows('updater-msg', 'checking for update');
	});

	autoUpdater.on('update-available', (msg) => {
		windows.sendMessageToAllWindows('updater-msg', 'update available');
	});

	const restart = () => {
		if (process.platform === 'darwin') {
			setImmediate(() => {
				app.removeAllListeners('window-all-closed');
				windows.sendMessageToAllWindows.send('updater-msg', 'closing main window');
				windows.closeAll();
			});
			autoUpdater.quitAndInstall(false);
		} else {
			setImmediate(() => {
				autoUpdater.quitAndInstall();
			});
		}
	};

	autoUpdater.on('error', (message) => {
		windows.sendMessageToAllWindows('updater-msg', `error: ${JSON.stringify(message)}`);
		console.error('There was a problem updating the application');
		console.error(message);
	});

	autoUpdater.on('update-downloaded', () => {
		windows.sendMessageToAllWindows('updater-msg', 'update downloaded');

		// notify user of restart bc of new version
		// mainWindow.webContents.send('will-restart', true);
		setTimeout(() => {
			restart();
		}, 10000);
	});
}

module.exports = { updater };
