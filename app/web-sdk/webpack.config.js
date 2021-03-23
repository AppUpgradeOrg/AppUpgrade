const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  devtool:
    process.env.NODE_ENV === "development" ? "inline-source-map" : undefined,
  target: "es3",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  mode: process.env.NODE_ENV || "none",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
