const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadURL('https://seu-site.com'); // Altere para a URL da sua webpage
	mainWindow.loadFile('index.html');
});