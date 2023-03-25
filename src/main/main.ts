/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import sound from 'sound-play'

app.disableHardwareAcceleration()

const alarmFilePath = path.join(__dirname, "/alarms/Alarm1.mp3")

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}


const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  let appWidth = 150
  let appHeight = 80
  const primaryDisplay = screen.getPrimaryDisplay()
  const {width, height} = primaryDisplay.workAreaSize
  let adjustedWidth = width - appWidth

  ipcMain.on('resize-me-pls', (event, arg) => {
    appWidth = 400
    appHeight = 400
    adjustedWidth = width - appWidth
    mainWindow?.setSize(appWidth, appHeight)
    mainWindow?.setPosition(adjustedWidth, 0)
  })
  ipcMain.on('reshrink-me-pls', (event, arg) => {
    appWidth = 150
    appHeight = 80
    adjustedWidth = width - appWidth
    mainWindow?.setSize(appWidth, appHeight)
    mainWindow?.setPosition(adjustedWidth, 0)
  })
  ipcMain.on('play-alarm', (event, arg) => {
    sound.play(alarmFilePath)
  })


  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };


  mainWindow = new BrowserWindow({
    show: false,
    width: appWidth,
    height: appHeight,
    icon: getAssetPath('icon.png'),
    alwaysOnTop: true,
    transparent: true,
    maximizable: true,
    minimizable: false,
    focusable: false,
    x: adjustedWidth,
    y: 0,
    useContentSize: true,
    frame: false,
    resizable: true,
    type: 'toolbar',
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
        devTools: true,
        nodeIntegration: true,
    },
  });

  mainWindow.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true})
  mainWindow.setAlwaysOnTop(true, 'floating', 1)
  mainWindow.setFullScreenable(false)

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
