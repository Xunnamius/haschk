/**
* !!! DO NOT EDIT THIS FILE DIRECTLY !!!
* ! This file has been generated automatically. See the config/*.js version of
* ! this file to make permanent modifications!
*/

"use strict";

require("source-map-support/register");

var _package = _interopRequireDefault(require("./package"));

var _webpack = _interopRequireDefault(require("webpack"));

var _path = require("path");

var _cleanWebpackPlugin = require("clean-webpack-plugin");

var _copyWebpackPlugin = _interopRequireDefault(require("copy-webpack-plugin"));

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _writeFileWebpackPlugin = _interopRequireDefault(require("write-file-webpack-plugin"));

var _parseGitignore = _interopRequireDefault(require("parse-gitignore"));

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const {
  HASHING_OUTPUT_LENGTH
} = process.env;
const paths = {};
paths.src = `${__dirname}/src`;
paths.gitIgnore = `${__dirname}/.gitignore`;
paths.build = `${__dirname}/build`;
paths.buildAssets = `${paths.build}/assets`;
paths.manifest = `${paths.src}/manifest.json`;
paths.components = `${paths.src}/components`;
paths.universe = `${paths.src}/universe`;
paths.assets = `${paths.src}/assets`;
const assetExtensions = ['jpg', 'jpeg', 'png', `gif`, "eot", 'otf', 'svg', 'ttf', 'woff', 'woff2'];

const configure = NODE_ENV => {
  const DEV_ENV = NODE_ENV === 'development';
  const options = {};
  options.mode = DEV_ENV ? 'development' : 'production';
  options.entry = {
    background: [`${paths.components}/background/index.js`],
    options: [`${paths.components}/options/index.js`],
    popup: [`${paths.components}/popup/index.js`]
  };
  options.output = {
    path: paths.build,
    filename: '[name].packed.js'
  };
  options.module = {
    rules: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader',
      exclude: /node_modules/
    }, {
      test: new RegExp(`\\.(${assetExtensions.join('|')})$`),
      loader: 'file-loader?name=[name].[ext]',
      exclude: /node_modules/
    }, {
      test: /\.html$/,
      loader: 'html-loader',
      exclude: /node_modules/
    }, {
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory',
      exclude: /node_modules/
    }]
  };
  options.plugins = [new _cleanWebpackPlugin.CleanWebpackPlugin(), new _webpack.default.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV),
      HASHING_OUTPUT_LENGTH: JSON.stringify(HASHING_OUTPUT_LENGTH)
    }
  }), new _copyWebpackPlugin.default([{
    from: paths.manifest,
    transform: content => Buffer.from(JSON.stringify({
      name: `${DEV_ENV ? "DEV-" : ''}${_package.default.name}`,
      description: _package.default.description,
      version: _package.default.version,
      'content_security_policy': `script-src 'self'${DEV_ENV ? " 'unsafe-eval'" : ''}; object-src 'self'`,
      ...JSON.parse(content.toString())
    }))
  }]), new _copyWebpackPlugin.default([{
    from: `${paths.assets}/icon/**/*.png`,
    to: `${paths.buildAssets}/icon/[1]`,
    test: /.*\/icon\/(.*)$/
  }]), new _htmlWebpackPlugin.default({
    template: `${paths.src}/popup.html`,
    filename: 'popup.html',
    chunks: ['popup']
  }), new _htmlWebpackPlugin.default({
    template: `${paths.src}/options.html`,
    filename: 'options.html',
    chunks: ['options']
  }), new _htmlWebpackPlugin.default({
    template: `${paths.src}/background.html`,
    filename: 'background.html',
    chunks: ['background']
  }), new _htmlWebpackPlugin.default({
    template: `${paths.src}/welcome.html`,
    filename: 'welcome.html'
  }), new _writeFileWebpackPlugin.default()];
  options.resolve = {};
  options.resolve.alias = {
    'components': paths.components,
    'universe': paths.universe
  };
  if (DEV_ENV) options.devtool = 'cheap-module-eval-source-map';

  if (NODE_ENV !== 'generator') {
    options.resolve.mainFields = ['browser', 'main'];
  }

  return options;
};

module.exports = env => configure(env.NODE_ENV);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy93ZWJwYWNrLmNvbmZpZy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiSEFTSElOR19PVVRQVVRfTEVOR1RIIiwicHJvY2VzcyIsImVudiIsInBhdGhzIiwic3JjIiwiX19kaXJuYW1lIiwiZ2l0SWdub3JlIiwiYnVpbGQiLCJidWlsZEFzc2V0cyIsIm1hbmlmZXN0IiwiY29tcG9uZW50cyIsInVuaXZlcnNlIiwiYXNzZXRzIiwiYXNzZXRFeHRlbnNpb25zIiwiY29uZmlndXJlIiwiTk9ERV9FTlYiLCJERVZfRU5WIiwib3B0aW9ucyIsIm1vZGUiLCJlbnRyeSIsImJhY2tncm91bmQiLCJwb3B1cCIsIm91dHB1dCIsInBhdGgiLCJmaWxlbmFtZSIsIm1vZHVsZSIsInJ1bGVzIiwidGVzdCIsImxvYWRlciIsImV4Y2x1ZGUiLCJSZWdFeHAiLCJqb2luIiwicGx1Z2lucyIsIkNsZWFuV2VicGFja1BsdWdpbiIsIndlYnBhY2siLCJEZWZpbmVQbHVnaW4iLCJKU09OIiwic3RyaW5naWZ5IiwiQ29weVdlYnBhY2tQbHVnaW4iLCJmcm9tIiwidHJhbnNmb3JtIiwiY29udGVudCIsIkJ1ZmZlciIsIm5hbWUiLCJwa2ciLCJkZXNjcmlwdGlvbiIsInZlcnNpb24iLCJwYXJzZSIsInRvU3RyaW5nIiwidG8iLCJIdG1sV2VicGFja1BsdWdpbiIsInRlbXBsYXRlIiwiY2h1bmtzIiwiV3JpdGVGaWxlV2VicGFja1BsdWdpbiIsInJlc29sdmUiLCJhbGlhcyIsImRldnRvb2wiLCJtYWluRmllbGRzIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUFBLE9BQU8sQ0FBQyxRQUFELENBQVAsQ0FBa0JDLE1BQWxCOztBQUVBLE1BQU07QUFBRUMsRUFBQUE7QUFBRixJQUE0QkMsT0FBTyxDQUFDQyxHQUExQztBQUVBLE1BQU1DLEtBQUssR0FB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RUFBRSxDQUFDLFNBQUQ7QUFIVSxHQUF0QixDQXJDYyxFQTJDZCxJQUFJRiwwQkFBSixDQUFzQjtBQUNsQkMsSUFBQUEsUUFBUSxFQUFHLEdBQUVoRCxLQUFLLENBQUNDLEdBQUksa0JBREw7QUFFbEJvQixJQUFBQSxRQUFRLEVBQUUsaUJBRlE7QUFHbEI0QixJQUFBQSxNQUFNLEVBQUUsQ0FBQyxZQUFEO0FBSFUsR0FBdEIsQ0EzQ2MsRUFpRGQsSUFBSUYsMEJBQUosQ0FBc0I7QUFDbEJDLElBQUFBLFFBQVEsRUFBRyxHQUFFaEQsS0FBSyxDQUFDQyxHQUFJLGVBREw7QUFFbEJvQixJQUFBQSxRQUFRLEVBQUU7QUFGUSxHQUF0QixDQWpEYyxFQXNEZCxJQUFJNkIsK0JBQUosRUF0RGMsQ0FBbEI7QUF5REFwQyxFQUFBQSxPQUFPLENBQUNxQyxPQUFSLEdBQWtCLEVBQWxCO0FBS0FyQyxFQUFBQSxPQUFPLENBQUNxQyxPQUFSLENBQWdCQyxLQUFoQixHQUF3QjtBQUNwQixrQkFBY3BELEtBQUssQ0FBQ08sVUFEQTtBQUVwQixnQkFBWVAsS0FBSyxDQUFDUTtBQUZFLEdBQXhCO0FBTUEsTUFBR0ssT0FBSCxFQUNJQyxPQUFPLENBQUN1QyxPQUFSLEdBQWtCLDhCQUFsQjs7QUFFSixNQUFHekMsUUFBUSxLQUFLLFdBQWhCLEVBQ0E7QUFFSUUsSUFBQUEsT0FBTyxDQUFDcUMsT0FBUixDQUFnQkcsVUFBaEIsR0FBNkIsQ0FBQyxTQUFELEVBQVksTUFBWixDQUE3QjtBQUNIOztBQUVELFNBQU94QyxPQUFQO0FBQ0gsQ0F4SEQ7O0FBMEhBUSxNQUFNLENBQUNpQyxPQUFQLEdBQWtCeEQsR0FBRCxJQUFnQ1ksU0FBUyxDQUFDWixHQUFHLENBQUNhLFFBQUwsQ0FBMUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG4vLyBmbG93LWRpc2FibGUtbGluZVxuaW1wb3J0IHBrZyBmcm9tICcuL3BhY2thZ2UnXG5pbXBvcnQgd2VicGFjayBmcm9tICd3ZWJwYWNrJ1xuaW1wb3J0IHsgam9pbiBhcyBqb2luUGF0aCB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBDbGVhbldlYnBhY2tQbHVnaW4gfSBmcm9tICdjbGVhbi13ZWJwYWNrLXBsdWdpbidcbmltcG9ydCBDb3B5V2VicGFja1BsdWdpbiBmcm9tICdjb3B5LXdlYnBhY2stcGx1Z2luJ1xuaW1wb3J0IEh0bWxXZWJwYWNrUGx1Z2luIGZyb20gJ2h0bWwtd2VicGFjay1wbHVnaW4nXG5pbXBvcnQgV3JpdGVGaWxlV2VicGFja1BsdWdpbiBmcm9tICd3cml0ZS1maWxlLXdlYnBhY2stcGx1Z2luJ1xuaW1wb3J0IHBhcnNlR2l0SWdub3JlIGZyb20gJ3BhcnNlLWdpdGlnbm9yZSdcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJ1xuXG5yZXF1aXJlKCdkb3RlbnYnKS5jb25maWcoKTtcblxuY29uc3QgeyBIQVNISU5HX09VVFBVVF9MRU5HVEggfSA9IHByb2Nlc3MuZW52O1xuXG5jb25zdCBwYXRocyA9IHt9O1xuXG5wYXRocy5zcmMgPSBgJHtfX2Rpcm5hbWV9L3NyY2A7XG5wYXRocy5naXRJZ25vcmUgPSBgJHtfX2Rpcm5hbWV9Ly5naXRpZ25vcmVgO1xucGF0aHMuYnVpbGQgPSBgJHtfX2Rpcm5hbWV9L2J1aWxkYDtcbnBhdGhzLmJ1aWxkQXNzZXRzID0gYCR7cGF0aHMuYnVpbGR9L2Fzc2V0c2A7XG5wYXRocy5tYW5pZmVzdCA9IGAke3BhdGhzLnNyY30vbWFuaWZlc3QuanNvbmA7XG5wYXRocy5jb21wb25lbnRzID0gYCR7cGF0aHMuc3JjfS9jb21wb25lbnRzYDtcbnBhdGhzLnVuaXZlcnNlID0gYCR7cGF0aHMuc3JjfS91bml2ZXJzZWA7XG5wYXRocy5hc3NldHMgPSBgJHtwYXRocy5zcmN9L2Fzc2V0c2A7XG5jb25zdCBhc3NldEV4dGVuc2lvbnMgPSBbJ2pwZycsICdqcGVnJywgJ3BuZycsIGBnaWZgLCBcImVvdFwiLCAnb3RmJywgJ3N2ZycsICd0dGYnLCAnd29mZicsICd3b2ZmMiddO1xuXG5jb25zdCBjb25maWd1cmUgPSAoTk9ERV9FTlY6ID9zdHJpbmcpID0+IHtcbiAgICBjb25zdCBERVZfRU5WID0gTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCc7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuXG4gICAgb3B0aW9ucy5tb2RlID0gREVWX0VOViA/ICdkZXZlbG9wbWVudCcgOiAncHJvZHVjdGlvbic7XG5cbiAgICBvcHRpb25zLmVudHJ5ID0ge1xuICAgICAgICBiYWNrZ3JvdW5kOiBbYCR7cGF0aHMuY29tcG9uZW50c30vYmFja2dyb3VuZC9pbmRleC5qc2BdLFxuICAgICAgICBvcHRpb25zOiBbYCR7cGF0aHMuY29tcG9uZW50c30vb3B0aW9ucy9pbmRleC5qc2BdLFxuICAgICAgICBwb3B1cDogW2Ake3BhdGhzLmNvbXBvbmVudHN9L3BvcHVwL2luZGV4LmpzYF0sXG4gICAgfTtcblxuICAgIG9wdGlvbnMub3V0cHV0ID0ge1xuICAgICAgICBwYXRoOiBwYXRocy5idWlsZCxcbiAgICAgICAgZmlsZW5hbWU6ICdbbmFtZV0ucGFja2VkLmpzJ1xuICAgIH07XG5cbiAgICBvcHRpb25zLm1vZHVsZSA9IHtcbiAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXN0OiAvXFwuY3NzJC8sXG4gICAgICAgICAgICAgICAgbG9hZGVyOiAnc3R5bGUtbG9hZGVyIWNzcy1sb2FkZXInLFxuICAgICAgICAgICAgICAgIGV4Y2x1ZGU6IC9ub2RlX21vZHVsZXMvXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRlc3Q6IG5ldyBSZWdFeHAoYFxcXFwuKCR7YXNzZXRFeHRlbnNpb25zLmpvaW4oJ3wnKX0pJGApLFxuICAgICAgICAgICAgICAgIGxvYWRlcjogJ2ZpbGUtbG9hZGVyP25hbWU9W25hbWVdLltleHRdJyxcbiAgICAgICAgICAgICAgICBleGNsdWRlOiAvbm9kZV9tb2R1bGVzL1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXN0OiAvXFwuaHRtbCQvLFxuICAgICAgICAgICAgICAgIGxvYWRlcjogJ2h0bWwtbG9hZGVyJyxcbiAgICAgICAgICAgICAgICBleGNsdWRlOiAvbm9kZV9tb2R1bGVzL1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXN0OiAvXFwuanMkLyxcbiAgICAgICAgICAgICAgICBsb2FkZXI6ICdiYWJlbC1sb2FkZXI/Y2FjaGVEaXJlY3RvcnknLFxuICAgICAgICAgICAgICAgIGV4Y2x1ZGU6IC9ub2RlX21vZHVsZXMvXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9O1xuXG4gICAgb3B0aW9ucy5wbHVnaW5zID0gW1xuICAgICAgICAvLyA/IENsZWFuIHBhdGhzLmJ1aWxkIChhZGRlZCBiZWxvdyBpbnN0ZWFkKVxuICAgICAgICBuZXcgQ2xlYW5XZWJwYWNrUGx1Z2luKCksXG5cbiAgICAgICAgLy8gPyBFeHBvc2UgZGVzaXJlZCBlbnZpcm9ubWVudCB2YXJpYWJsZXMgaW4gdGhlIHBhY2tlZCBidW5kbGVcbiAgICAgICAgbmV3IHdlYnBhY2suRGVmaW5lUGx1Z2luKHtcbiAgICAgICAgICAgICdwcm9jZXNzLmVudic6IHtcbiAgICAgICAgICAgICAgICBOT0RFX0VOVjogSlNPTi5zdHJpbmdpZnkoTk9ERV9FTlYpLFxuICAgICAgICAgICAgICAgIEhBU0hJTkdfT1VUUFVUX0xFTkdUSDogSlNPTi5zdHJpbmdpZnkoSEFTSElOR19PVVRQVVRfTEVOR1RIKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuXG4gICAgICAgIG5ldyBDb3B5V2VicGFja1BsdWdpbihbe1xuICAgICAgICAgICAgZnJvbTogcGF0aHMubWFuaWZlc3QsXG5cbiAgICAgICAgICAgIC8vID8gR2VuZXJhdGVzIG91ciBtYW5pZmVzdCBmaWxlIHVzaW5nIGluZm8gZnJvbSBwYWNrYWdlLmpzb25cbiAgICAgICAgICAgIHRyYW5zZm9ybTogY29udGVudCA9PiBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgbmFtZTogYCR7REVWX0VOViA/IFwiREVWLVwiIDogJyd9JHtwa2cubmFtZX1gLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBwa2cuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogcGtnLnZlcnNpb24sXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRfc2VjdXJpdHlfcG9saWN5JzogYHNjcmlwdC1zcmMgJ3NlbGYnJHtERVZfRU5WID8gXCIgJ3Vuc2FmZS1ldmFsJ1wiIDogJyd9OyBvYmplY3Qtc3JjICdzZWxmJ2AsXG4gICAgICAgICAgICAgICAgLi4uSlNPTi5wYXJzZShjb250ZW50LnRvU3RyaW5nKCkpXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgfV0pLFxuXG4gICAgICAgIG5ldyBDb3B5V2VicGFja1BsdWdpbihbe1xuICAgICAgICAgICAgZnJvbTogYCR7cGF0aHMuYXNzZXRzfS9pY29uLyoqLyoucG5nYCxcbiAgICAgICAgICAgIHRvOiBgJHtwYXRocy5idWlsZEFzc2V0c30vaWNvbi9bMV1gLFxuICAgICAgICAgICAgdGVzdDogLy4qXFwvaWNvblxcLyguKikkL1xuICAgICAgICB9XSksXG5cbiAgICAgICAgbmV3IEh0bWxXZWJwYWNrUGx1Z2luKHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiBgJHtwYXRocy5zcmN9L3BvcHVwLmh0bWxgLFxuICAgICAgICAgICAgZmlsZW5hbWU6ICdwb3B1cC5odG1sJyxcbiAgICAgICAgICAgIGNodW5rczogWydwb3B1cCddXG4gICAgICAgIH0pLFxuXG4gICAgICAgIG5ldyBIdG1sV2VicGFja1BsdWdpbih7XG4gICAgICAgICAgICB0ZW1wbGF0ZTogYCR7cGF0aHMuc3JjfS9vcHRpb25zLmh0bWxgLFxuICAgICAgICAgICAgZmlsZW5hbWU6ICdvcHRpb25zLmh0bWwnLFxuICAgICAgICAgICAgY2h1bmtzOiBbJ29wdGlvbnMnXVxuICAgICAgICB9KSxcblxuICAgICAgICBuZXcgSHRtbFdlYnBhY2tQbHVnaW4oe1xuICAgICAgICAgICAgdGVtcGxhdGU6IGAke3BhdGhzLnNyY30vYmFja2dyb3VuZC5odG1sYCxcbiAgICAgICAgICAgIGZpbGVuYW1lOiAnYmFja2dyb3VuZC5odG1sJyxcbiAgICAgICAgICAgIGNodW5rczogWydiYWNrZ3JvdW5kJ11cbiAgICAgICAgfSksXG5cbiAgICAgICAgbmV3IEh0bWxXZWJwYWNrUGx1Z2luKHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiBgJHtwYXRocy5zcmN9L3dlbGNvbWUuaHRtbGAsXG4gICAgICAgICAgICBmaWxlbmFtZTogJ3dlbGNvbWUuaHRtbCdcbiAgICAgICAgfSksXG5cbiAgICAgICAgbmV3IFdyaXRlRmlsZVdlYnBhY2tQbHVnaW4oKVxuICAgIF07XG5cbiAgICBvcHRpb25zLnJlc29sdmUgPSB7fTtcblxuICAgIC8vID8gVGhlc2UgYXJlIGFsaWFzZXMgdGhhdCBjYW4gYmUgdXNlZCBkdXJpbmcgSlMgaW1wb3J0IGNhbGxzXG4gICAgLy8gISBOb3RlIHRoYXQgeW91IG11c3QgYWxzbyBjaGFuZ2UgdGhlc2Ugc2FtZSBhbGlhc2VzIGluIC5mbG93Y29uZmlnXG4gICAgLy8gISBOb3RlIHRoYXQgeW91IG11c3QgYWxzbyBjaGFuZ2UgdGhlc2Ugc2FtZSBhbGlhc2VzIGluIHBhY2thZ2UuanNvbiAoamVzdClcbiAgICBvcHRpb25zLnJlc29sdmUuYWxpYXMgPSB7XG4gICAgICAgICdjb21wb25lbnRzJzogcGF0aHMuY29tcG9uZW50cyxcbiAgICAgICAgJ3VuaXZlcnNlJzogcGF0aHMudW5pdmVyc2VcbiAgICB9O1xuXG4gICAgLy8gPyBTZWU6IGh0dHBzOi8vd2VicGFjay5qcy5vcmcvY29uZmlndXJhdGlvbi9kZXZ0b29sXG4gICAgaWYoREVWX0VOVilcbiAgICAgICAgb3B0aW9ucy5kZXZ0b29sID0gJ2NoZWFwLW1vZHVsZS1ldmFsLXNvdXJjZS1tYXAnO1xuXG4gICAgaWYoTk9ERV9FTlYgIT09ICdnZW5lcmF0b3InKVxuICAgIHtcbiAgICAgICAgLy8gPyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9pcGZzL2pzLWlwZnMtYXBpL3B1bGwvNzc3XG4gICAgICAgIG9wdGlvbnMucmVzb2x2ZS5tYWluRmllbGRzID0gWydicm93c2VyJywgJ21haW4nXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gKGVudjogeyBOT0RFX0VOVjogP3N0cmluZyB9KSA9PiBjb25maWd1cmUoZW52Lk5PREVfRU5WKTtcbiJdfQ==