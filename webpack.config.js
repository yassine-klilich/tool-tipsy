var HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    "yk-tool-tipsy": "./src/yk-tool-tipsy.js",
    script: "./src/script.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      }
    ]
  },
  output: {
    filename: "[name].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      scriptLoading: "blocking"
    }),
    new MiniCssExtractPlugin()
  ]
};