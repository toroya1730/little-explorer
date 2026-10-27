const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

// กำหนด Serial Key ที่คุณต้องการตายตัวตรงนี้เลย (ลูกค้าทุกคนใช้รหัสนี้กรอกเปิดใช้งาน)
const VALID_SERIAL_KEY = "ABC-1234-XYZ"; 

function getLicenseFilePath() {
  return path.join(app.getPath('userData'), 'license.json');
}

function checkLicense() {
  try {
    const filePath = getLicenseFilePath();
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (data.key === VALID_SERIAL_KEY) {
        return true;
      }
    }
  } catch (e) {}
  return false;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // ถ้าเคยลงทะเบียนแล้วเข้าหน้า index.html ถ้ายังให้กรอกรหัสที่ activate.html
  if (checkLicense()) {
    mainWindow.loadFile('index.html');
  } else {
    mainWindow.loadFile('activate.html');
  }
}

// รับรหัสที่ลูกค้ากรอกเข้ามาเช็คกับรหัสตายตัว
ipcMain.on('check-key', (event, inputKey) => {
  if (inputKey.trim() === VALID_SERIAL_KEY) {
    const filePath = getLicenseFilePath();
    fs.writeFileSync(filePath, JSON.stringify({ key: VALID_SERIAL_KEY }));
    mainWindow.loadFile('index.html');
  } else {
    event.sender.send('key-result', false);
  }
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
