import * as path from 'path';
import {app, dialog, ipcMain, BrowserWindow} from 'electron';

/**
 * Whether or not we're running packaged or in standalone 'development' mode.
 *
 * @const
 * @type {boolean}
 */
const isDevMode = process.execPath.match(/[\\/]electron/);
/**
 * Whether or not the remote debugger is enabled.
 *
 * @const
 * @type {boolean}
 */
const remoteDebugging = (() => {
    for (let i = 0; i < process.argv.length; i++) {
        if (process.argv[i].match(/^--remote-debugging-port/)) {
            return true;
        }
    }
    return false;
})();
/**
 * The main browser window.
 *
 * @type {Electron.BrowserWindow}
 */
let mainWindow: Electron.BrowserWindow | null = null;

/**
 * Create a new browser window.
 *
 * @function
 * @async
 */
const createWindow = async () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false
    });

    // Load the web app index.
    mainWindow.loadURL(`file://${path.resolve(__dirname, '../renderer/index.html')}`);

    // Open the DevTools when running in 'development' mode.
    if (isDevMode && !remoteDebugging) {
        mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow == null) {
        createWindow();
    }
});

ipcMain.on('app-ready', () => {
    // Check that the window still exists.
    if (mainWindow != null && !mainWindow.isVisible()) {
        // Show it!
        mainWindow.show();
    }
});

ipcMain.on('fatal-error', (_evt, err) => {
    dialog.showErrorBox('Fatal Error', [
        'A fatal error has occurred while launching the application.',
        'Please file a bug report at',
        '',
        'https://github.com/glek/pacman-gui/issues',
        '',
        'Include the following information if possible:',
        '',
        '* The version of the application.',
        '* What you were doing at the time the error happened.',
        '* The steps to reproduce the error.',
        '* Any other useful information.',
        '* The error message below or a screenshot of this dialog.',
        '',
        err
    ].join('\n'));
    app.exit(128);
});
