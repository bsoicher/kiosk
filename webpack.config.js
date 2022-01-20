const path = require("path");
const htmlDoc = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",

  plugins: [
    new htmlDoc({
      title: "Development",
    }),
    new CopyPlugin({
      patterns: [{ from: "node_modules/@mediapipe/pose", to: "pose" }],
    }),
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    static: "./dist",
  },
};
