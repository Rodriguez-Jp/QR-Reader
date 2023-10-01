const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
    background: "./src/background.js",
    contentScript: "./src/contentScript.js",
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "static" }],
    }),
  ],
};
