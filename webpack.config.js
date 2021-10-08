const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  target: 'node',
  mode: 'none',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'robo.js'
  },
  externals: {
    puppeteer: "require('puppeteer')",
  },
  resolve: {
    extensions: [".js", ".json"],
    mainFields: ["main"],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "startRobo.sh" },
        { from: "README.md" },
      ],
    }),
  ],
  ignoreWarnings: [
    /warning/,
    /Error: Can't resolve 'encoding' in*/,
    /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/
  ]
};