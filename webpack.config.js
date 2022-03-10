const path = require("path");

// Plugins
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  plugins: [
    new HtmlPlugin({
      title: "CAF Fitness Kiosk Demo",
      template: './src/index.ejs',
    }),
    new HtmlPlugin({
      template: './src/debug.html',
      filename: 'debug.html',
      inject: false
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
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  devServer: {
    static: "./dist",
    open: { app: { name: "firefox" } }
  },
};
