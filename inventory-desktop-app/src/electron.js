import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import { createDB } from "./modules/database/create-db.js";
import DB from "./modules/database/connect-db.js";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {},
  });

  mainWindow.loadURL("http://localhost:5173");
}

createDB();

const database = new DB();
database.query("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, quantity INTEGER, price INTEGER, image TEXT)");

database.close()

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
