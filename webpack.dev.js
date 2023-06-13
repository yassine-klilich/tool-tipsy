const common = require("./webpack.common");
const { merge } = require("webpack-merge");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  entry: {
    "yk-tooltip": "./src/yk-tooltip.js",
    script: "./src/script.js"
  },
  mode: "development",
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
});