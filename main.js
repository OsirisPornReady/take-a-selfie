const {app, BrowserWindow, ipcMain} = require('electron')
  const url = require('url')
  const path = require('path')
  const fs = require('fs')

  let mainWindow

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })

    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, `/dist/index.html`),
        protocol: "file:",
        slashes: true
      })
    );
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
      mainWindow = null
    })
  }

  app.on('ready', createWindow)

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', function () {
    if (mainWindow === null) createWindow()
  })

  ipcMain.handle('saveImage', (event,args) => {
    // console.log(args)
    const base64Data = args.replace(/^data:image\/png;base64,/, "")
    fs.writeFile("D:\\Codes\\electronCodes\\picStore\\newPic.jpg", base64Data, 'base64', function(err) {
      console.log(err);
    });
  })
