"use strict";

const {
  app,
  Tray,
  Menu,
  dialog,
  MenuItem,
  nativeImage,
  BrowserWindow,
  ipcMain,
} = require("electron");

import * as path from "path";
import * as fs from "fs";

import { format as formatUrl } from "url";

const isDevelopment = process.env.NODE_ENV !== "production";
const trayIcon = nativeImage.createFromPath(
  path.resolve(__dirname, "../../public/tray.png")
);

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
      enableRemoteModule: true,
    },
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
        slashes: true,
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
  const tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show Window",
      type: "normal",
      click() {
        if (!mainWindow) {
          mainWindow = createMainWindow();
        }
      },
    },
    {
      label: "Quit",
      type: "normal",
      click() {
        process.exit(0);
      },
    },
  ]);

  tray.setToolTip("Tesla Editor");
  tray.setContextMenu(contextMenu);

  mainWindow = createMainWindow();
});
app.on("open-file", (event, filePath) => {
  mainWindow = createMainWindow();
  mainWindow.webContents.send("open-file", path);
});
app.on("will-quit", (event) => {
  if (
    dialog.showMessageBoxSync(mainWindow, {
      type: "question",
      title: "Tesla Editor",
      message: "Are you sure you want to quit?",
      buttons: ["Yes", "No"],
    }) === 1
  ) {
    event.preventDefault();
    mainWindow = createMainWindow();
  }
});

function loadFileIntoRenderer(filename) {
  mainWindow.webContents.send("open-file", filename);
}

ipcMain.on("quit", () => {
  process.exit(0);
});

const menu = new Menu();
menu.append(
  new MenuItem({
    label: "Tesla Editor",
    submenu: [
      {
        role: "new",
        label: "New",
        accelerator: process.platform === "darwin" ? "Cmd+N" : "Ctrl+N",
        click: () => {
          if (!mainWindow) {
            mainWindow = createMainWindow();
          }
        },
      },
      {
        role: "save",
        label: "Save",
        accelerator: process.platform === "darwin" ? "Cmd+S" : "Ctrl+S",
        click: () => {
          const result = dialog.showSaveDialogSync(mainWindow, {
            title: "Save a file",
            message: "binary files are not supported",
            defaultPath: path.resolve(__dirname, "../.."),
            properties: ["saveFile", "showHiddenFiles"],
          });
          if (!result) {
            return;
          }
          const [filename] = result;
          if (fs.existsSync(filename)) {
            mainWindow.webContents.send("save-file", filename);
          }
        },
      },
      {
        role: "open",
        label: "Open",
        accelerator: process.platform === "darwin" ? "Cmd+O" : "Ctrl+O",
        click: () => {
          const result = dialog.showOpenDialogSync(mainWindow, {
            title: "Open a file",
            message: "binary files are not supported",
            defaultPath: path.resolve(__dirname, "../.."),
            properties: ["openFile", "showHiddenFiles"],
          });
          if (!result) {
            return;
          }
          const [filename] = result;
          if (fs.existsSync(filename)) {
            loadFileIntoRenderer(filename);
          }
        },
      },
      {
        role: "close",
        label: "Close",
        accelerator: process.platform === "darwin" ? "Cmd+W" : "Ctrl+W",
      },
      {
        role: "quit",
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Cmd+Q" : "Alt+F4",
      },
    ],
  })
);

Menu.setApplicationMenu(menu);
