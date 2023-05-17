const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const remoteMain                          = require('@electron/remote/main');
const serve                               = require('electron-serve');

const isMac = process.platform === 'darwin'

remoteMain.initialize();
serve({directory: __dirname + '/static'});

function initApp(){

  let win = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: 'rsc/icon.ico',
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })

  win.loadURL('file://' + __dirname + '/index.html');
  win.webContents.once('dom-ready',()=>{
    win.show();
    win.center();
  });

  remoteMain.enable(win.webContents);
}

app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', function () { if (BrowserWindow.getAllWindows().length === 0) initApp(); });
app.whenReady().then(initApp);
