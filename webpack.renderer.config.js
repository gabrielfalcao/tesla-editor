const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
//const CopyPlugin = require("copy-webpack-plugin");
//const WriteFilePlugin = require("write-file-webpack-plugin");
const { ProvidePlugin } = require("webpack");
const path = require("path");
const fs = require("fs");
const { dependencies } = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json"))
);

const srcPath = path.resolve(__dirname, "src");
const PRODUCTION = process.env.NODE_ENV === "production";
const monacoPath = path.resolve(__dirname, "node_modules/monaco-editor/min");

module.exports = {
  /* 'errors-only'     Only output when errors happen
   * 'errors-warnings' Only output errors and warnings happen
   * 'minimal'	       Only output when errors or new compilation happen
   * 'none'            Output nothing
   * 'normal'          Standard output
   * 'verbose'         Output everything
   * 'detailed'        Output everything except chunkModules and chunkRootModules
   * 'summary'         Output webpack version, warnings count and errors count
   */
  stats: "errors-warnings",
  /* infrastructureLogging: {
   *   level: "verbose"
   * }, */
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.ttf$/,
        exclude: /(node_modules)/,
        include: monacoPath,
        use: ["file-loader"]
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        include: monacoPath,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    modules: [srcPath, "node_modules"],
    alias: {
      //"monaco-editor": monacoPath
    }
  },
  devtool: "inline-source-map",
  plugins: [
    /* new CopyPlugin({
     *     patterns: [
     *         { 'from': "node_modules/monaco-editor/min/vs/", 'to': "vs" },
     *         !PRODUCTION && { from: "node_modules/monaco-editor/min-maps/vs/", "to": "min-maps/vs" }
     *     ].filter(Boolean)
     * }),
     * new WriteFilePlugin({
     *     test: /vs/,
     *     useHashIndex: true
     * }), */
    /* new ProvidePlugin({
     *   monaco: monacoPath
     * }), */
    new MonacoWebpackPlugin()
  ]
};
