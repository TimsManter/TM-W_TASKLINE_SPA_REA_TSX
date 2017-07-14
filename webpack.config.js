const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/tsx/App.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        exclude: /(node_modules)/,
        options: {
          configFile: 'tslint.json'
        }
      },
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },

      {
        test: /\.scss$/,
        include: path.resolve(__dirname, "src/scss"),
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/ejs/index.ejs"
    })
  ]
};