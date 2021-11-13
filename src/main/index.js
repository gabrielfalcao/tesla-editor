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
  const icon = nativeImage.createFromPath(
    path.resolve(__dirname, "../../public/tray.png")
  );

  const tray = new Tray(icon);

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

  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);

  mainWindow = createMainWindow();
});
app.on("will-quit", (event) => {
  if (
    dialog.showMessageBoxSync(mainWindow, {
      type: "question",
      message: "Are you sure you want to quit?",
      buttons: ["Yes", "No"],
    }) === 1
  ) {
    event.preventDefault();
    mainWindow = createMainWindow();
  }
});

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

function writeFile(filename, content) {
  const bytes = fs.writeFileSync(resolveHome(filename), content, {
    encoding: "utf-8",
  });
  console.log(`wrote ${filename}: ${bytes}`);
  mainWindow.webContents.send("file-written", { content, filename, bytes });
}

function loadFileIntoRenderer(filename) {
  const content = fs.readFileSync(resolveHome(filename), "utf-8");
  mainWindow.webContents.send("file-loaded", {
    content,
    filename,
  });
}
ipcMain.on("read-file", (event, filename) => {
  loadFileIntoRenderer(filename);
});
ipcMain.on("write-code", (event, { filename, content }) => {
  writeFile(filename, content);
});

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
        label: "new",
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
          mainWindow.webContents.send("save-file");
        },
      },
      {
        role: "open",
        label: "Open",
        accelerator: process.platform === "darwin" ? "Cmd+O" : "Ctrl+O",
        click: () => {
          const [filename] = dialog.showOpenDialogSync(mainWindow, {
            title: "Open a file",
            message: "binary files are not supported",
            defaultPath: path.resolve(__dirname, "../.."),
            properties: ["openFile", "showHiddenFiles"],
          });
          if (filename) {
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
