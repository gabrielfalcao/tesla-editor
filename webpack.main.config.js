const path = require("path");

const srcPath = path.resolve(__dirname, "src");

module.exports = {
  stats: "verbose",
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    modules: [srcPath, "node_modules"]
  },
  devtool: "inline-source-map",
  plugins: []
};
