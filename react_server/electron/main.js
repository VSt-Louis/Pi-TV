const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron');
const path = require('path');
const storage = require('electron-json-storage');
const express = require('express');
const socketio = require('socket.io');

const io = socketio(5000, {path: '/remote'});
io.set('origins', '*:*');

//global window object
var win;

const storeWindowState = (win) => {
  let windowState = {}; 
  windowState.isMaximized = win.isMaximized();
  windowState.isFullScreen = win.isFullScreen()
  if (!windowState.isMaximized && !windowState.isFullScreen) { 
    // only update bounds if the window isn’t currently maximized    
    windowState.bounds = win.getBounds(); 
  }
  storage.set('windowState', windowState);
};




//Window

function createWindow (windowState) {  
  // Create the browser window.
  win = new BrowserWindow({
    x: windowState.bounds && windowState.bounds.x || undefined, 
    y: windowState.bounds && windowState.bounds.y || undefined,   
    width: windowState.bounds && windowState.bounds.width || 800, 
    height: windowState.bounds && windowState.bounds.height || 600,
    backgroundColor: '#deeced',
    show: true,
    title :'Pi-TV',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.removeMenu();
  win.loadURL('http://192.168.0.11:3000')
  win.on('ready-to-show', () => { 
    win.focus(); 
  });
  win.on('close', storeWindowState.bind(null, win))
  win.on('resize', storeWindowState.bind(null, win))
  win.webContents.openDevTools()
  if (windowState.isMaximized) { 
    win.maximize();
  }
  if (windowState.isFullScreen) { 
   win.setFullScreen(true);
  }
  globalShortcut.register('F11', () => {
    win.setFullScreen(!win.isFullScreen())
  });
  globalShortcut.register('Control+j', () => {
    win.webContents.openDevTools()
  });
  globalShortcut.register('f5', () => {
    win.reload();
  });
  return win;
}

app.on('ready', () => {
  storage.get('windowState', (err, state) => {
    let win = createWindow(state);
    ioListen(win);
  });
});
app.on('window-all-closed', app.quit);






//Socket.io and ipc

ioListen = (win) => {
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('info', 'Electron finished loading')
  });
  

  io.on('connection', socket => {
    
    //remote to app communication
    console.log('client connected');
    socket.on('command', command => {
      console.log('command: ' + command);
      
      //forward to react app
      win.webContents.send('command', command)
    });
    socket.on('text', text => {
      console.log('text: ' + text);
      
      //forward to react app
      win.webContents.send('text', text)
    });
    socket.on('fullscreen', () => {
      win.setFullScreen(!win.isFullScreen())
    });
    
    //app to remote communication
    ipcMain.on('info', (event, info) => {
      console.log('(app): info: ' + info);

      //forward to remote
        socket.emit('info', info)
    });
    
    
  });
}






