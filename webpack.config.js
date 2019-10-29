const path = require('path');

const nodeConfig = {
  entry: './src/com/atomgraph/linkeddatahub/query/SPARQLBuilder.ts',
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  target: 'node',
  output: {
    filename: 'SPARQLBuilder.js',
    path: path.resolve(__dirname, 'dist/node')
  }
};

const webConfig = {
  entry: './src/com/atomgraph/linkeddatahub/query/SPARQLBuilder.ts',
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    library: ["SPARQLBuilder"],
    libraryTarget: "window",
    filename: 'SPARQLBuilder.js',
    path: path.resolve(__dirname, 'dist/window')
  }
};

module.exports = [ nodeConfig, webConfig ];