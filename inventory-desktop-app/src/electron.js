import { app, BrowserWindow, nativeTheme } from "electron";
import isDev from "electron-is-dev";
import { createDB } from "./modules/database/create-db.js";
import { createServer } from "./modules/api.js";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    webPreferences: {},
  });

  mainWindow.loadURL("http://localhost:5173");
}

createDB();
createServer();

nativeTheme.themeSource = 'light';

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    process.exit(0);
  }
});
