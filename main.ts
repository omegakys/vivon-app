import { app, BrowserWindow } from 'electron';
import * as path from 'path';

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow(): void {
	const mainWindow = new BrowserWindow({
		height: 800,
		width: 1200,
		minHeight: 600,
		minWidth: 800,
		backgroundColor: '#09090b', // Tailwind's stone-950
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			devTools: isDev, // Only enable DevTools in development
		},
	});

	if (isDev) {
		// Use the actual port from your Vite server
		mainWindow.loadURL('http://localhost:5173').catch((err) => {
			console.error('Failed to load dev server:', err);
		});

		// Only open DevTools if load was successful
		mainWindow.webContents.once('did-finish-load', () => {
			mainWindow.webContents.openDevTools();
		});
	} else {
		// Load from built files in production
		mainWindow
			.loadFile(path.join(__dirname, '../frontend/dist/index.html'))
			.catch((err) => {
				console.error('Failed to load production build:', err);
			});
	}

	// Handle window creation errors
	mainWindow.on('unresponsive', () => {
		console.error('Window became unresponsive! Attempting to reload...');
		mainWindow.reload();
	});
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
