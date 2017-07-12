const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/tsx/App.jsx",
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

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.jsx?$/,
        loader: "source-map-loader"
      }
    ]
  },

  // Enable sourcemaps for debugging webpack's output.
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