const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devServer: {
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:44313", // Ustaw to na adres twojego serwera API
        changeOrigin: true,
      },
    },
  },
  mode: "production",
  entry: {
    login: "./src/Login.js",
    //dashboard: './src/App.js',
  },
  output: {
    filename: "[name].js",
    publicPath: "/",
    path: path.resolve(__dirname, "build"),
    library: "loginLib",
    libraryTarget: "window",
    // libraryExport: 'default',
  },
  module: {
    // exports: {
    //     entry: {
    //         login: './src/Login.js',
    //         dashboard: './src/App.js'
    //     },
    //     output: {
    //         filename: '[name].js',
    //         publicPath: "/",
    //         path: path.resolve(__dirname, "build"),
    //     }
    // },
    rules: [
      {
        test: /\.(jpe?g|png)$/,
        exclude: /node_modules/,
        // use: ["url-loader", "file-loader"]
        use: "file-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        use: "file-loader",
      },
      // {
      //     test: /\.(png|svg|jpg|jpeg|gif)$/i,
      //     use: "url-loader"
      // },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      //template: "./public/index.html"
    }),
  ],
};
