/**
* !!! DO NOT EDIT THIS FILE DIRECTLY !!!
* ! This file has been generated automatically. See the config/*.js version of
* ! this file to make permanent modifications!
*/

"use strict";

require("source-map-support/register");

var _package = _interopRequireDefault(require("./package"));

var _webpack = _interopRequireDefault(require("webpack"));

var _cleanWebpackPlugin = _interopRequireDefault(require("clean-webpack-plugin"));

var _copyWebpackPlugin = _interopRequireDefault(require("copy-webpack-plugin"));

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _writeFileWebpackPlugin = _interopRequireDefault(require("write-file-webpack-plugin"));

var _parseGitignore = _interopRequireDefault(require("parse-gitignore"));

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const {
  NODE_ENV,
  HASHING_ALGORITHM,
  HASHING_OUTPUT_LENGTH
} = process.env;
const DEV_ENV = NODE_ENV === 'development';
const paths = {};
paths.src = `${__dirname}/src`;
paths.build = `${__dirname}/build`;
paths.buildAssets = `${paths.build}/assets`;
paths.buildGitIgnore = `${paths.build}/.gitignore`;
paths.srcManifest = `${paths.src}/manifest.json`;
paths.components = `${paths.src}/components`;
paths.assets = `${paths.src}/assets`;
const assetExtensions = ['jpg', 'jpeg', 'png', `gif`, "eot", 'otf', 'svg', 'ttf', 'woff', 'woff2'];
const options = {};
options.mode = DEV_ENV ? 'development' : 'production';
options.entry = {
  background: `${paths.components}/background/index.js`,
  options: `${paths.components}/options/index.js`,
  popup: `${paths.components}/popup/index.js`,
  content: `${paths.components}/content/index.js`
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
options.plugins = [new _webpack.default.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(NODE_ENV),
    HASHING_ALGORITHM: JSON.stringify(HASHING_ALGORITHM),
    HASHING_OUTPUT_LENGTH: JSON.stringify(HASHING_OUTPUT_LENGTH)
  }
}), new _copyWebpackPlugin.default([{
  from: paths.srcManifest,
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
}), new _writeFileWebpackPlugin.default()];
options.resolve = {};
options.resolve.alias = {
  'universe': `${__dirname}/src/universe/`
};
if (DEV_ENV) options.devtool = 'cheap-module-eval-source-map';

if (NODE_ENV !== 'generator') {
  options.resolve.mainFields = ['browser', 'main'];
}

const exclude = (0, _parseGitignore.default)((0, _fs.readFileSync)(paths.buildGitIgnore)).filter(path => path.startsWith('!')).map(path => path.substr(1));
options.plugins = [new _cleanWebpackPlugin.default([paths.build], {
  exclude
}), ...options.plugins];
module.exports = options;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy93ZWJwYWNrLmNvbmZpZy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiTk9ERV9FTlYiLCJIQVNISU5HX0FMR09SSVRITSIsIkhBU0hJTkdfT1VUUFVUX0xFTkdUSCIsInByb2Nlc3MiLCJlbnYiLCJERVZfRU5WIiwicGF0aHMiLCJzcmMiLCJfX2Rpcm5hbWUiLCJidWlsZCIsImJ1aWxkQXNzZXRzIiwiYnVpbGRHaXRJZ25vcmUiLCJzcmNNYW5pZmVzdCIsImNvbXBvbmVudHMiLCJhc3NldHMiLCJhc3NldEV4dGVuc2lvbnMiLCJvcHRpb25zIiwibW9kZSIsImVudHJ5IiwiYmFja2dyb3VuZCIsInBvcHVwIiwiY29udGVudCIsIm91dHB1dCIsInBhdGgiLCJmaWxlbmFtZSIsIm1vZHVsZSIsInJ1bGVzIiwidGVzdCIsImxvYWRlciIsImV4Y2x1ZGUiLCJSZWdFeHAiLCJqb2luIiwicGx1Z2lucyIsIndlYnBhY2siLCJEZWZpbmVQbHVnaW4iLCJKU09OIiwic3RyaW5naWZ5IiwiQ29weVdlYnBhY2tQbHVnaW4iLCJmcm9tIiwidHJhbnNmb3JtIiwiQnVmZmVyIiwibmFtZSIsInBrZyIsImRlc2NyaXB0aW9uIiwidmVyc2lvbiIsInBhcnNlIiwidG9TdHJpbmciLCJ0byIsIkh0bWxXZWJwYWNrUGx1Z2luIiwidGVtcGxhdGUiLCJjaHVua3MiLCJXcml0ZUZpbGVXZWJwYWNrUGx1Z2luIiwicmVzb2x2ZSIsImFsaWFzIiwiZGV2dG9vbCIsIm1haW5GaWVsZHMiLCJmaWx0ZXIiLCJzdGFydHNXaXRoIiwibWFwIiwic3Vic3RyIiwiQ2xlYW5XZWJwYWNrUGx1Z2luIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUFBLE9BQU8sQ0FBQyxRQUFELENBQVAsQ0FBa0JDLE1BQWxCOztBQUVBLE1BQU07QUFBRUMsRUFBQUEsUUFBRjtBQUFZQyxFQUFBQSxpQkFBWjtBQUErQkMsRUFBQUE7QUFBL0IsSUFBeURDLE9BQU8sQ0FBQ0MsR0FBdkU7QUFDQSxNQUFNQyxPQUFPLEdBQUdMLFFBQVEsS0FBSyxhQUE3QjtBQUVBLE1BQU1NLEtBQUssR0FBRyxFQUFkO0FBRUFBLEtBQUssQ0FBQ0MsR0FBTixHQUFhLEdBQUVDLFNBQVUsTUFBekI7QUFDQUYsS0FBSyxDQUFDRyxLQUFOLEdBQWUsR0FBRUQsU0FBVSxRQUEzQjtBQUNBRixLQUFLLENBQUNJLFdBQU4sR0FBcUIsR0FBRUosS0FBSyxDQUFDRyxLQUFNLFNBQW5DO0FBQ0FILEtBQUssQ0FBQ0ssY0FBTixHQUF3QixHQUFFTCxLQUFLLENBQUNHLEtBQU0sYUFBdEM7QUFDQUgsS0FBSyxDQUFDTSxXQUFOLEdBQXFCLEdBQUVOLEtBQUssQ0FBQ0MsR0FBSSxnQkFBakM7QUFDQUQsS0FBSyxDQUFDTyxVQUFOLEdBQW9CLEdBQUVQLEtBQUssQ0FBQ0MsR0FBSSxhQUFoQztBQUNBRCxLQUFLLENBQUNRLE1BQU4sR0FBZ0IsR0FBRVIsS0FBSyxDQUFDQyxHQUFJLFNBQTVCO0FBQ0EsTUFBTVEsZUFBZSxHQUFHLENBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsS0FBaEIsRUFBd0IsS0FBeEIsRUFBOEIsS0FBOUIsRUFBcUMsS0FBckMsRUFBNEMsS0FBNUMsRUFBbUQsS0FBbkQsRUFBMEQsTUFBMUQsRUFBa0UsT0FBbEUsQ0FBeEI7QUFJQSxNQUFNQyxPQUFlLEdBQUcsRUFBeEI7QUFFQUEsT0FBTyxDQUFDQyxJQUFSLEdBQWVaLE9BQU8sR0FBRyxhQUFILEdBQW1CLFlBQXpDO0FBRUFXLE9BQU8sQ0FBQ0UsS0FBUixHQUFnQjtBQUNaQyxFQUFBQSxVQUFVLEVBQUcsR0FBRWIsS0FBSyxDQUFDTyxVQUFXLHNCQURwQjtBQUVaRyxFQUFBQSxPQUFPLEVBQUcsR0FBRVYsS0FBSyxDQUFDTyxVQUFXLG1CQUZqQjtBQUdaTyxFQUFBQSxLQUFLLEVBQUcsR0FBRWQsS0FBSyxDQUFDTyxVQUFXLGlCQUhmO0FBSVpRLEVBQUFBLE9BQU8sRUFBRyxHQUFFZixLQUFLLENBQUNPLFVBQVc7QUFKakIsQ0FBaEI7QUFPQUcsT0FBTyxDQUFDTSxNQUFSLEdBQWlCO0FBQ2JDLEVBQUFBLElBQUksRUFBRWpCLEtBQUssQ0FBQ0csS0FEQztBQUViZSxFQUFBQSxRQUFRLEVBQUU7QUFGRyxDQUFqQjtBQUtBUixPQUFPLENBQUNTLE1BQVIsR0FBaUI7QUFDYkMsRUFBQUEsS0FBSyxFQUFFLENBQ0g7QUFDSUMsSUFBQUEsSUFBSSxFQUFFLFFBRFY7QUFFSUMsSUFBQUEsTUFBTSxFQUFFLHlCQUZaO0FBR0lDLElBQUFBLE9BQU8sRUFBRTtBQUhiLEdBREcsRUFNSDtBQUNJRixJQUFBQSxJQUFJLEVBQUUsSUFBSUcsTUFBSixDQUFZLE9BQU1mLGVBQWUsQ0FBQ2dCLElBQWhCLENBQXFCLEdBQXJCLENBQTBCLElBQTVDLENBRFY7QUFFSUgsSUFBQUEsTUFBTSxFQUFFLCtCQUZaO0FBR0lDLElBQUFBLE9BQU8sRUFBRTtBQUhiLEdBTkcsRUFXSDtBQUNJRixJQUFBQSxJQUFJLEVBQUUsU0FEVjtBQUVJQyxJQUFBQSxNQUFNLEVBQUUsYUFGWjtBQUdJQyxJQUFBQSxPQUFPLEVBQUU7QUFIYixHQVhHLEVBZ0JIO0FBQ0lGLElBQUFBLElBQUksRUFBRSxPQURWO0FBRUlDLElBQUFBLE1BQU0sRUFBRSw2QkFGWjtBQUdJQyxJQUFBQSxPQUFPLEVBQUU7QUFIYixHQWhCRztBQURNLENBQWpCO0FBeUJBYixPQUFPLENBQUNnQixPQUFSLEdBQWtCLENBS2QsSUFBSUMsaUJBQVFDLFlBQVosQ0FBeUI7QUFDckIsaUJBQWU7QUFDWGxDLElBQUFBLFFBQVEsRUFBRW1DLElBQUksQ0FBQ0MsU0FBTCxDQUFlcEMsUUFBZixDQURDO0FBRVhDLElBQUFBLGlCQUFpQixFQUFFa0MsSUFBSSxDQUFDQyxTQUFMLENBQWVuQyxpQkFBZixDQUZSO0FBR1hDLElBQUFBLHFCQUFxQixFQUFFaUMsSUFBSSxDQUFDQyxTQUFMLENBQWVsQyxxQkFBZjtBQUhaO0FBRE0sQ0FBekIsQ0FMYyxFQWFkLElBQUltQywwQkFBSixDQUFzQixDQUFDO0FBQ25CQyxFQUFBQSxJQUFJLEVBQUVoQyxLQUFLLENBQUNNLFdBRE87QUFJbkIyQixFQUFBQSxTQUFTLEVBQUVsQixPQUFPLElBQUltQixNQUFNLENBQUNGLElBQVAsQ0FBWUgsSUFBSSxDQUFDQyxTQUFMLENBQWU7QUFDN0NLLElBQUFBLElBQUksRUFBRyxHQUFFcEMsT0FBTyxHQUFHLE1BQUgsR0FBWSxFQUFHLEdBQUVxQyxpQkFBSUQsSUFBSyxFQURHO0FBRTdDRSxJQUFBQSxXQUFXLEVBQUVELGlCQUFJQyxXQUY0QjtBQUc3Q0MsSUFBQUEsT0FBTyxFQUFFRixpQkFBSUUsT0FIZ0M7QUFJN0MsK0JBQTRCLG9CQUFtQnZDLE9BQU8sR0FBRyxnQkFBSCxHQUFzQixFQUFHLHFCQUpsQztBQUs3QyxPQUFHOEIsSUFBSSxDQUFDVSxLQUFMLENBQVd4QixPQUFPLENBQUN5QixRQUFSLEVBQVg7QUFMMEMsR0FBZixDQUFaO0FBSkgsQ0FBRCxDQUF0QixDQWJjLEVBMEJkLElBQUlULDBCQUFKLENBQXNCLENBQUM7QUFDbkJDLEVBQUFBLElBQUksRUFBRyxHQUFFaEMsS0FBSyxDQUFDUSxNQUFPLGdCQURIO0FBRW5CaUMsRUFBQUEsRUFBRSxFQUFHLEdBQUV6QyxLQUFLLENBQUNJLFdBQVksV0FGTjtBQUduQmlCLEVBQUFBLElBQUksRUFBRTtBQUhhLENBQUQsQ0FBdEIsQ0ExQmMsRUFnQ2QsSUFBSXFCLDBCQUFKLENBQXNCO0FBQ2xCQyxFQUFBQSxRQUFRLEVBQUcsR0FBRTNDLEtBQUssQ0FBQ0MsR0FBSSxhQURMO0FBRWxCaUIsRUFBQUEsUUFBUSxFQUFFLFlBRlE7QUFHbEIwQixFQUFBQSxNQUFNLEVBQUUsQ0FBQyxPQUFEO0FBSFUsQ0FBdEIsQ0FoQ2MsRUFzQ2QsSUFBSUYsMEJBQUosQ0FBc0I7QUFDbEJDLEVBQUFBLFFBQVEsRUFBRyxHQUFFM0MsS0FBSyxDQUFDQyxHQUFJLGVBREw7QUFFbEJpQixFQUFBQSxRQUFRLEVBQUUsY0FGUTtBQUdsQjBCLEVBQUFBLE1BQU0sRUFBRSxDQUFDLFNBQUQ7QUFIVSxDQUF0QixDQXRDYyxFQTRDZCxJQUFJRiwwQkFBSixDQUFzQjtBQUNsQkMsRUFBQUEsUUFBUSxFQUFHLEdBQUUzQyxLQUFLLENBQUNDLEdBQUksa0JBREw7QUFFbEJpQixFQUFBQSxRQUFRLEVBQUUsaUJBRlE7QUFHbEIwQixFQUFBQSxNQUFNLEVBQUUsQ0FBQyxZQUFEO0FBSFUsQ0FBdEIsQ0E1Q2MsRUFrRGQsSUFBSUMsK0JBQUosRUFsRGMsQ0FBbEI7QUFxREFuQyxPQUFPLENBQUNvQyxPQUFSLEdBQWtCLEVBQWxCO0FBS0FwQyxPQUFPLENBQUNvQyxPQUFSLENBQWdCQyxLQUFoQixHQUF3QjtBQUNwQixjQUFhLEdBQUU3QyxTQUFVO0FBREwsQ0FBeEI7QUFLQSxJQUFHSCxPQUFILEVBQ0lXLE9BQU8sQ0FBQ3NDLE9BQVIsR0FBa0IsOEJBQWxCOztBQUVKLElBQUd0RCxRQUFRLEtBQUssV0FBaEIsRUFDQTtBQUVJZ0IsRUFBQUEsT0FBTyxDQUFDb0MsT0FBUixDQUFnQkcsVUFBaEIsR0FBNkIsQ0FBQyxTQUFELEVBQVksTUFBWixDQUE3QjtBQUNIOztBQUVELE1BQU0xQixPQUFPLEdBQUcsNkJBQWUsc0JBQWF2QixLQUFLLENBQUNLLGNBQW5CLENBQWYsRUFDWDZDLE1BRFcsQ0FDSmpDLElBQUksSUFBSUEsSUFBSSxDQUFDa0MsVUFBTCxDQUFnQixHQUFoQixDQURKLEVBRVhDLEdBRlcsQ0FFUG5DLElBQUksSUFBSUEsSUFBSSxDQUFDb0MsTUFBTCxDQUFZLENBQVosQ0FGRCxDQUFoQjtBQUtBM0MsT0FBTyxDQUFDZ0IsT0FBUixHQUFrQixDQUNkLElBQUk0QiwyQkFBSixDQUF1QixDQUFDdEQsS0FBSyxDQUFDRyxLQUFQLENBQXZCLEVBQXNDO0FBQUVvQixFQUFBQTtBQUFGLENBQXRDLENBRGMsRUFFZCxHQUFHYixPQUFPLENBQUNnQixPQUZHLENBQWxCO0FBS0FQLE1BQU0sQ0FBQ29DLE9BQVAsR0FBaUI3QyxPQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbi8vIGZsb3ctZGlzYWJsZS1saW5lXG5pbXBvcnQgcGtnIGZyb20gJy4vcGFja2FnZSdcbmltcG9ydCB3ZWJwYWNrIGZyb20gJ3dlYnBhY2snXG5pbXBvcnQgQ2xlYW5XZWJwYWNrUGx1Z2luIGZyb20gJ2NsZWFuLXdlYnBhY2stcGx1Z2luJ1xuaW1wb3J0IENvcHlXZWJwYWNrUGx1Z2luIGZyb20gJ2NvcHktd2VicGFjay1wbHVnaW4nXG5pbXBvcnQgSHRtbFdlYnBhY2tQbHVnaW4gZnJvbSAnaHRtbC13ZWJwYWNrLXBsdWdpbidcbmltcG9ydCBXcml0ZUZpbGVXZWJwYWNrUGx1Z2luIGZyb20gJ3dyaXRlLWZpbGUtd2VicGFjay1wbHVnaW4nXG5pbXBvcnQgcGFyc2VHaXRJZ25vcmUgZnJvbSAncGFyc2UtZ2l0aWdub3JlJ1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnXG5cbnJlcXVpcmUoJ2RvdGVudicpLmNvbmZpZygpO1xuXG5jb25zdCB7IE5PREVfRU5WLCBIQVNISU5HX0FMR09SSVRITSwgSEFTSElOR19PVVRQVVRfTEVOR1RIIH0gPSBwcm9jZXNzLmVudjtcbmNvbnN0IERFVl9FTlYgPSBOT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcblxuY29uc3QgcGF0aHMgPSB7fTtcblxucGF0aHMuc3JjID0gYCR7X19kaXJuYW1lfS9zcmNgO1xucGF0aHMuYnVpbGQgPSBgJHtfX2Rpcm5hbWV9L2J1aWxkYDtcbnBhdGhzLmJ1aWxkQXNzZXRzID0gYCR7cGF0aHMuYnVpbGR9L2Fzc2V0c2A7XG5wYXRocy5idWlsZEdpdElnbm9yZSA9IGAke3BhdGhzLmJ1aWxkfS8uZ2l0aWdub3JlYDtcbnBhdGhzLnNyY01hbmlmZXN0ID0gYCR7cGF0aHMuc3JjfS9tYW5pZmVzdC5qc29uYDtcbnBhdGhzLmNvbXBvbmVudHMgPSBgJHtwYXRocy5zcmN9L2NvbXBvbmVudHNgO1xucGF0aHMuYXNzZXRzID0gYCR7cGF0aHMuc3JjfS9hc3NldHNgO1xuY29uc3QgYXNzZXRFeHRlbnNpb25zID0gWydqcGcnLCAnanBlZycsICdwbmcnLCBgZ2lmYCwgXCJlb3RcIiwgJ290ZicsICdzdmcnLCAndHRmJywgJ3dvZmYnLCAnd29mZjInXTtcblxuLy8gKiBXZWJwYWNrIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuXG5jb25zdCBvcHRpb25zOiBPYmplY3QgPSB7fTtcblxub3B0aW9ucy5tb2RlID0gREVWX0VOViA/ICdkZXZlbG9wbWVudCcgOiAncHJvZHVjdGlvbic7XG5cbm9wdGlvbnMuZW50cnkgPSB7XG4gICAgYmFja2dyb3VuZDogYCR7cGF0aHMuY29tcG9uZW50c30vYmFja2dyb3VuZC9pbmRleC5qc2AsXG4gICAgb3B0aW9uczogYCR7cGF0aHMuY29tcG9uZW50c30vb3B0aW9ucy9pbmRleC5qc2AsXG4gICAgcG9wdXA6IGAke3BhdGhzLmNvbXBvbmVudHN9L3BvcHVwL2luZGV4LmpzYCxcbiAgICBjb250ZW50OiBgJHtwYXRocy5jb21wb25lbnRzfS9jb250ZW50L2luZGV4LmpzYFxufTtcblxub3B0aW9ucy5vdXRwdXQgPSB7XG4gICAgcGF0aDogcGF0aHMuYnVpbGQsXG4gICAgZmlsZW5hbWU6ICdbbmFtZV0ucGFja2VkLmpzJ1xufTtcblxub3B0aW9ucy5tb2R1bGUgPSB7XG4gICAgcnVsZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGVzdDogL1xcLmNzcyQvLFxuICAgICAgICAgICAgbG9hZGVyOiAnc3R5bGUtbG9hZGVyIWNzcy1sb2FkZXInLFxuICAgICAgICAgICAgZXhjbHVkZTogL25vZGVfbW9kdWxlcy9cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGVzdDogbmV3IFJlZ0V4cChgXFxcXC4oJHthc3NldEV4dGVuc2lvbnMuam9pbignfCcpfSkkYCksXG4gICAgICAgICAgICBsb2FkZXI6ICdmaWxlLWxvYWRlcj9uYW1lPVtuYW1lXS5bZXh0XScsXG4gICAgICAgICAgICBleGNsdWRlOiAvbm9kZV9tb2R1bGVzL1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXN0OiAvXFwuaHRtbCQvLFxuICAgICAgICAgICAgbG9hZGVyOiAnaHRtbC1sb2FkZXInLFxuICAgICAgICAgICAgZXhjbHVkZTogL25vZGVfbW9kdWxlcy9cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGVzdDogL1xcLmpzJC8sXG4gICAgICAgICAgICBsb2FkZXI6ICdiYWJlbC1sb2FkZXI/Y2FjaGVEaXJlY3RvcnknLFxuICAgICAgICAgICAgZXhjbHVkZTogL25vZGVfbW9kdWxlcy9cbiAgICAgICAgfVxuICAgIF1cbn07XG5cbm9wdGlvbnMucGx1Z2lucyA9IFtcbiAgICAvLyA/IENsZWFuIHBhdGhzLmJ1aWxkIChzZWUgYmVsb3cpXG4gICAgLy8gbmV3IENsZWFuV2VicGFja1BsdWdpbihbJ2J1aWxkJ10pLFxuXG4gICAgLy8gPyBFeHBvc2UgZGVzaXJlZCBlbnZpcm9ubWVudCB2YXJpYWJsZXMgaW4gdGhlIHBhY2tlZCBidW5kbGVcbiAgICBuZXcgd2VicGFjay5EZWZpbmVQbHVnaW4oe1xuICAgICAgICAncHJvY2Vzcy5lbnYnOiB7XG4gICAgICAgICAgICBOT0RFX0VOVjogSlNPTi5zdHJpbmdpZnkoTk9ERV9FTlYpLFxuICAgICAgICAgICAgSEFTSElOR19BTEdPUklUSE06IEpTT04uc3RyaW5naWZ5KEhBU0hJTkdfQUxHT1JJVEhNKSxcbiAgICAgICAgICAgIEhBU0hJTkdfT1VUUFVUX0xFTkdUSDogSlNPTi5zdHJpbmdpZnkoSEFTSElOR19PVVRQVVRfTEVOR1RIKSxcbiAgICAgICAgfSxcbiAgICB9KSxcblxuICAgIG5ldyBDb3B5V2VicGFja1BsdWdpbihbe1xuICAgICAgICBmcm9tOiBwYXRocy5zcmNNYW5pZmVzdCxcblxuICAgICAgICAvLyA/IEdlbmVyYXRlcyBvdXIgbWFuaWZlc3QgZmlsZSB1c2luZyBpbmZvIGZyb20gcGFja2FnZS5qc29uXG4gICAgICAgIHRyYW5zZm9ybTogY29udGVudCA9PiBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBuYW1lOiBgJHtERVZfRU5WID8gXCJERVYtXCIgOiAnJ30ke3BrZy5uYW1lfWAsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogcGtnLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgdmVyc2lvbjogcGtnLnZlcnNpb24sXG4gICAgICAgICAgICAnY29udGVudF9zZWN1cml0eV9wb2xpY3knOiBgc2NyaXB0LXNyYyAnc2VsZicke0RFVl9FTlYgPyBcIiAndW5zYWZlLWV2YWwnXCIgOiAnJ307IG9iamVjdC1zcmMgJ3NlbGYnYCxcbiAgICAgICAgICAgIC4uLkpTT04ucGFyc2UoY29udGVudC50b1N0cmluZygpKVxuICAgICAgICB9KSlcbiAgICB9XSksXG5cbiAgICBuZXcgQ29weVdlYnBhY2tQbHVnaW4oW3tcbiAgICAgICAgZnJvbTogYCR7cGF0aHMuYXNzZXRzfS9pY29uLyoqLyoucG5nYCxcbiAgICAgICAgdG86IGAke3BhdGhzLmJ1aWxkQXNzZXRzfS9pY29uL1sxXWAsXG4gICAgICAgIHRlc3Q6IC8uKlxcL2ljb25cXC8oLiopJC9cbiAgICB9XSksXG5cbiAgICBuZXcgSHRtbFdlYnBhY2tQbHVnaW4oe1xuICAgICAgICB0ZW1wbGF0ZTogYCR7cGF0aHMuc3JjfS9wb3B1cC5odG1sYCxcbiAgICAgICAgZmlsZW5hbWU6ICdwb3B1cC5odG1sJyxcbiAgICAgICAgY2h1bmtzOiBbJ3BvcHVwJ11cbiAgICB9KSxcblxuICAgIG5ldyBIdG1sV2VicGFja1BsdWdpbih7XG4gICAgICAgIHRlbXBsYXRlOiBgJHtwYXRocy5zcmN9L29wdGlvbnMuaHRtbGAsXG4gICAgICAgIGZpbGVuYW1lOiAnb3B0aW9ucy5odG1sJyxcbiAgICAgICAgY2h1bmtzOiBbJ29wdGlvbnMnXVxuICAgIH0pLFxuXG4gICAgbmV3IEh0bWxXZWJwYWNrUGx1Z2luKHtcbiAgICAgICAgdGVtcGxhdGU6IGAke3BhdGhzLnNyY30vYmFja2dyb3VuZC5odG1sYCxcbiAgICAgICAgZmlsZW5hbWU6ICdiYWNrZ3JvdW5kLmh0bWwnLFxuICAgICAgICBjaHVua3M6IFsnYmFja2dyb3VuZCddXG4gICAgfSksXG5cbiAgICBuZXcgV3JpdGVGaWxlV2VicGFja1BsdWdpbigpXG5dO1xuXG5vcHRpb25zLnJlc29sdmUgPSB7fTtcblxuLy8gPyBUaGVzZSBhcmUgYWxpYXNlcyB0aGF0IGNhbiBiZSB1c2VkIGR1cmluZyBKUyBpbXBvcnQgY2FsbHNcbi8vICEgTm90ZSB0aGF0IHlvdSBtdXN0IGFsc28gY2hhbmdlIHRoZXNlIHNhbWUgYWxpYXNlcyBpbiAuZmxvd2NvbmZpZ1xuLy8gISBOb3RlIHRoYXQgeW91IG11c3QgYWxzbyBjaGFuZ2UgdGhlc2Ugc2FtZSBhbGlhc2VzIGluIHBhY2thZ2UuanNvbiAoamVzdClcbm9wdGlvbnMucmVzb2x2ZS5hbGlhcyA9IHtcbiAgICAndW5pdmVyc2UnOiBgJHtfX2Rpcm5hbWV9L3NyYy91bml2ZXJzZS9gXG59O1xuXG4vLyA/IFNlZTogaHR0cHM6Ly93ZWJwYWNrLmpzLm9yZy9jb25maWd1cmF0aW9uL2RldnRvb2xcbmlmKERFVl9FTlYpXG4gICAgb3B0aW9ucy5kZXZ0b29sID0gJ2NoZWFwLW1vZHVsZS1ldmFsLXNvdXJjZS1tYXAnO1xuXG5pZihOT0RFX0VOViAhPT0gJ2dlbmVyYXRvcicpXG57XG4gICAgLy8gPyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9pcGZzL2pzLWlwZnMtYXBpL3B1bGwvNzc3XG4gICAgb3B0aW9ucy5yZXNvbHZlLm1haW5GaWVsZHMgPSBbJ2Jyb3dzZXInLCAnbWFpbiddO1xufVxuXG5jb25zdCBleGNsdWRlID0gcGFyc2VHaXRJZ25vcmUocmVhZEZpbGVTeW5jKHBhdGhzLmJ1aWxkR2l0SWdub3JlKSlcbiAgICAuZmlsdGVyKHBhdGggPT4gcGF0aC5zdGFydHNXaXRoKCchJykpXG4gICAgLm1hcChwYXRoID0+IHBhdGguc3Vic3RyKDEpKTtcblxuLy8gPyBUaGlzIGZvbGxvd2luZyBpcyBuZWNlc3Nhcnkgc28gQ2xlYW5XZWJwYWNrUGx1Z2luIGRvZXNuJ3Qga2lsbCBidWlsZC8uZ2l0aWdub3JlXG5vcHRpb25zLnBsdWdpbnMgPSBbXG4gICAgbmV3IENsZWFuV2VicGFja1BsdWdpbihbcGF0aHMuYnVpbGRdLCB7IGV4Y2x1ZGUgfSksXG4gICAgLi4ub3B0aW9ucy5wbHVnaW5zXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9wdGlvbnM7XG4iXX0=