const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/jsx/App.jsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },
  module: {
    rules: [
      /*{
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
      },*/
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.scss$/,
        include: __dirname + "/src/scss",
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        enforce: "pre",
        test: /\.jsx?$/,
        loader: "source-map-loader"
      }
    ]
  },
  devtool: "source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },
  devServer: {
    contentBase: __dirname + "/dist"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/ejs/index.ejs"
    })
  ]
};