"use strict";

const {
  app,
  Tray,
  Menu,
  nativeImage,
  BrowserWindow,
  ipcMain
} = require("electron");

import * as path from "path";
import * as fs from "fs";
import { format as formatUrl } from "url";

const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
app.allowRendererProcessReuse = true;
function createMainWindow() {
  const window = new BrowserWindow({
    icon: path.resolve(__dirname, "../../public/app.ico"),
    width: 1280,
    height: 960,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  if (isDevelopment) {
    window.webContents.openDevTools({ mode: "detach" });
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow();
});

/* app.on("ready", () => {
 *   const icon = nativeImage.createFromPath(path.resolve(__dirname, "tray.png"));
 *
 *   tray = new Tray(icon);
 *
 *   const contextMenu = Menu.buildFromTemplate([
 *     {
 *       label: "Show Window",
 *       type: "normal",
 *       click(menuItem, browserWindow, event) {
 *         createMainWindow();
 *       }
 *     },
 *     {
 *       label: "Quit",
 *       type: "normal",
 *       click(menuItem, browserWindow, event) {
 *         process.exit(0);
 *       }
 *     }
 *   ]);
 *
 *   tray.setToolTip("This is my application.");
 *   tray.setContextMenu(contextMenu);
 *
 * });
 *  */
ipcMain.on("anything-asynchronous", (event, arg) => {
  //execute tasks on behalf of renderer process
  console.log(arg); // prints "ping"
  event.reply("asynchronous-reply", new Date().toString());
});
function resolveHome(filepath) {
  if (filepath[0] === "~") {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return path.resolve(filepath);
}

function loadFileIntoRenderer(event, filename) {
  const content = fs.readFileSync(resolveHome(filename), "utf-8");
  event.reply("file-loaded", { content, filename });
}
ipcMain.on("read-file", (event, filename) => {
  loadFileIntoRenderer(event, filename);
});

ipcMain.on("quit", (event, filename) => {
  process.exit(0);
});
