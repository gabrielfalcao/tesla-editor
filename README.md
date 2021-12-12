# Tesla Editor

![screenshot.png](screencast.mp4)
A simple editor powered by [Electron](https://www.electronjs.org/), [react](https://reactjs.org/) and [Monaco Editor](https://microsoft.github.io/monaco-editor/)

* Built with [electron-webpack](https://webpack.electron.build/)
* Use [`webpack-dev-server`](https://github.com/webpack/webpack-dev-server) for development
* Hot Module Reloading for both `renderer` and `main` processes
* Auto configures [`babel-preset-env`](https://github.com/babel/babel-preset-env) based on the `electron` version
* Use [`electron-builder`](https://github.com/electron-userland/electron-builder) to package and build a distributable electron application.

## Getting Started

Simply clone down this repository, install dependencies, and get started on your application.

The use of the [yarn](https://yarnpkg.com/) package manager is **strongly** recommended, as opposed to using `npm`.

```bash
git clone git@github.com:gabrielfalcao/tesla-editor.git
cd tesla-editor
yarn
```

### Development Scripts

```bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```

----

Based on the excellent [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate).
