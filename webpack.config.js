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
  NODE_ENV
} = process.env;
const DEV_ENV = NODE_ENV === 'development';
const paths = {};
paths.src = `${__dirname}/src`;
paths.build = `${__dirname}/build`;
paths.buildGitIgnore = `${paths.build}/.gitignore`;
paths.srcManifest = `${paths.src}/manifest.json`;
paths.components = `${paths.src}/components`;
const assetExtensions = ['jpg', 'jpeg', 'png', `gif`, "eot", 'otf', 'svg', 'ttf', 'woff', 'woff2'];
const options = {};
options.mode = DEV_ENV ? 'development' : 'production';
options.entry = {
  background: `${paths.components}/background/index.js`,
  options: `${paths.components}/options/index.js`,
  popup: `${paths.components}/popup/index.js`
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
  }]
};
options.plugins = [new _webpack.default.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
}), new _copyWebpackPlugin.default([{
  from: paths.srcManifest,
  transform: content => Buffer.from(JSON.stringify({
    name: `${DEV_ENV ? "DEV-" : ''}${_package.default.name}`,
    description: _package.default.description,
    version: _package.default.version,
    'content_security_policy': `script-src 'self'${DEV_ENV ? " 'unsafe-eval'" : ''}; object-src 'self'`,
    ...JSON.parse(content.toString())
  }))
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
if (NODE_ENV === 'development') options.devtool = 'cheap-module-eval-source-map';
const exclude = (0, _parseGitignore.default)((0, _fs.readFileSync)(paths.buildGitIgnore)).filter(path => path.startsWith('!')).map(path => path.substr(1));
options.plugins = [new _cleanWebpackPlugin.default([paths.build], {
  exclude
}), ...options.plugins];
module.exports = options;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy93ZWJwYWNrLmNvbmZpZy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiTk9ERV9FTlYiLCJwcm9jZXNzIiwiZW52IiwiREVWX0VOViIsInBhdGhzIiwic3JjIiwiX19kaXJuYW1lIiwiYnVpbGQiLCJidWlsZEdpdElnbm9yZSIsInNyY01hbmlmZXN0IiwiY29tcG9uZW50cyIsImFzc2V0RXh0ZW5zaW9ucyIsIm9wdGlvbnMiLCJtb2RlIiwiZW50cnkiLCJiYWNrZ3JvdW5kIiwicG9wdXAiLCJvdXRwdXQiLCJwYXRoIiwiZmlsZW5hbWUiLCJtb2R1bGUiLCJydWxlcyIsInRlc3QiLCJsb2FkZXIiLCJleGNsdWRlIiwiUmVnRXhwIiwiam9pbiIsInBsdWdpbnMiLCJ3ZWJwYWNrIiwiRGVmaW5lUGx1Z2luIiwiSlNPTiIsInN0cmluZ2lmeSIsIkNvcHlXZWJwYWNrUGx1Z2luIiwiZnJvbSIsInRyYW5zZm9ybSIsImNvbnRlbnQiLCJCdWZmZXIiLCJuYW1lIiwicGtnIiwiZGVzY3JpcHRpb24iLCJ2ZXJzaW9uIiwicGFyc2UiLCJ0b1N0cmluZyIsIkh0bWxXZWJwYWNrUGx1Z2luIiwidGVtcGxhdGUiLCJjaHVua3MiLCJXcml0ZUZpbGVXZWJwYWNrUGx1Z2luIiwiZGV2dG9vbCIsImZpbHRlciIsInN0YXJ0c1dpdGgiLCJtYXAiLCJzdWJzdHIiLCJDbGVhbldlYnBhY2tQbHVnaW4iLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQUEsT0FBTyxDQUFDLFFBQUQsQ0FBUCxDQUFrQkMsTUFBbEI7O0FBRUEsTUFBTTtBQUFFQyxFQUFBQTtBQUFGLElBQWVDLE9BQU8sQ0FBQ0MsR0FBN0I7QUFDQSxNQUFNQyxPQUFPLEdBQUdILFFBQVEsS0FBSyxhQUE3QjtBQUVBLE1BQU1JLEtBQUssR0FBRyxFQUFkO0FBRUFBLEtBQUssQ0FBQ0MsR0FBTixH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XG5pbXBvcnQgcGtnIGZyb20gJy4vcGFja2FnZSdcbmltcG9ydCB3ZWJwYWNrIGZyb20gJ3dlYnBhY2snXG5pbXBvcnQgQ2xlYW5XZWJwYWNrUGx1Z2luIGZyb20gJ2NsZWFuLXdlYnBhY2stcGx1Z2luJ1xuaW1wb3J0IENvcHlXZWJwYWNrUGx1Z2luIGZyb20gJ2NvcHktd2VicGFjay1wbHVnaW4nXG5pbXBvcnQgSHRtbFdlYnBhY2tQbHVnaW4gZnJvbSAnaHRtbC13ZWJwYWNrLXBsdWdpbidcbmltcG9ydCBXcml0ZUZpbGVXZWJwYWNrUGx1Z2luIGZyb20gJ3dyaXRlLWZpbGUtd2VicGFjay1wbHVnaW4nXG5pbXBvcnQgcGFyc2VHaXRJZ25vcmUgZnJvbSAncGFyc2UtZ2l0aWdub3JlJ1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnXG5cbnJlcXVpcmUoJ2RvdGVudicpLmNvbmZpZygpO1xuXG5jb25zdCB7IE5PREVfRU5WIH0gPSBwcm9jZXNzLmVudjtcbmNvbnN0IERFVl9FTlYgPSBOT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcblxuY29uc3QgcGF0aHMgPSB7fTtcblxucGF0aHMuc3JjID0gYCR7X19kaXJuYW1lfS9zcmNgO1xucGF0aHMuYnVpbGQgPSBgJHtfX2Rpcm5hbWV9L2J1aWxkYDtcbnBhdGhzLmJ1aWxkR2l0SWdub3JlID0gYCR7cGF0aHMuYnVpbGR9Ly5naXRpZ25vcmVgO1xucGF0aHMuc3JjTWFuaWZlc3QgPSBgJHtwYXRocy5zcmN9L21hbmlmZXN0Lmpzb25gO1xucGF0aHMuY29tcG9uZW50cyA9IGAke3BhdGhzLnNyY30vY29tcG9uZW50c2A7XG5cbmNvbnN0IGFzc2V0RXh0ZW5zaW9ucyA9IFsnanBnJywgJ2pwZWcnLCAncG5nJywgYGdpZmAsIFwiZW90XCIsICdvdGYnLCAnc3ZnJywgJ3R0ZicsICd3b2ZmJywgJ3dvZmYyJ107XG5cbi8vICogV2VicGFjayBjb25maWd1cmF0aW9uIG9wdGlvbnNcblxuY29uc3Qgb3B0aW9uczogT2JqZWN0ID0ge307XG5cbm9wdGlvbnMubW9kZSA9IERFVl9FTlYgPyAnZGV2ZWxvcG1lbnQnIDogJ3Byb2R1Y3Rpb24nO1xuXG5vcHRpb25zLmVudHJ5ID0ge1xuICAgIGJhY2tncm91bmQ6IGAke3BhdGhzLmNvbXBvbmVudHN9L2JhY2tncm91bmQvaW5kZXguanNgLFxuICAgIG9wdGlvbnM6IGAke3BhdGhzLmNvbXBvbmVudHN9L29wdGlvbnMvaW5kZXguanNgLFxuICAgIHBvcHVwOiBgJHtwYXRocy5jb21wb25lbnRzfS9wb3B1cC9pbmRleC5qc2Bcbn07XG5cbm9wdGlvbnMub3V0cHV0ID0ge1xuICAgIHBhdGg6IHBhdGhzLmJ1aWxkLFxuICAgIGZpbGVuYW1lOiAnW25hbWVdLnBhY2tlZC5qcydcbn07XG5cbm9wdGlvbnMubW9kdWxlID0ge1xuICAgIHJ1bGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlc3Q6IC9cXC5jc3MkLyxcbiAgICAgICAgICAgIGxvYWRlcjogJ3N0eWxlLWxvYWRlciFjc3MtbG9hZGVyJyxcbiAgICAgICAgICAgIGV4Y2x1ZGU6IC9ub2RlX21vZHVsZXMvXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlc3Q6IG5ldyBSZWdFeHAoYFxcXFwuKCR7YXNzZXRFeHRlbnNpb25zLmpvaW4oJ3wnKX0pJGApLFxuICAgICAgICAgICAgbG9hZGVyOiAnZmlsZS1sb2FkZXI/bmFtZT1bbmFtZV0uW2V4dF0nLFxuICAgICAgICAgICAgZXhjbHVkZTogL25vZGVfbW9kdWxlcy9cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGVzdDogL1xcLmh0bWwkLyxcbiAgICAgICAgICAgIGxvYWRlcjogJ2h0bWwtbG9hZGVyJyxcbiAgICAgICAgICAgIGV4Y2x1ZGU6IC9ub2RlX21vZHVsZXMvXG4gICAgICAgIH1cbiAgICBdXG59O1xuXG5vcHRpb25zLnBsdWdpbnMgPSBbXG4gICAgLy8gPyBDbGVhbiBwYXRocy5idWlsZCAoc2VlIGJlbG93KVxuICAgIC8vIG5ldyBDbGVhbldlYnBhY2tQbHVnaW4oWydidWlsZCddKSxcblxuICAgIC8vID8gRXhwb3NlIGRlc2lyZWQgZW52aXJvbm1lbnQgdmFyaWFibGVzIGluIHRoZSBwYWNrZWQgYnVuZGxlXG4gICAgbmV3IHdlYnBhY2suRGVmaW5lUGx1Z2luKHtcbiAgICAgICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogSlNPTi5zdHJpbmdpZnkoTk9ERV9FTlYpXG4gICAgfSksXG5cbiAgICBuZXcgQ29weVdlYnBhY2tQbHVnaW4oW3tcbiAgICAgICAgZnJvbTogcGF0aHMuc3JjTWFuaWZlc3QsXG5cbiAgICAgICAgLy8gPyBHZW5lcmF0ZXMgb3VyIG1hbmlmZXN0IGZpbGUgdXNpbmcgaW5mbyBmcm9tIHBhY2thZ2UuanNvblxuICAgICAgICB0cmFuc2Zvcm06IGNvbnRlbnQgPT4gQnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgbmFtZTogYCR7REVWX0VOViA/IFwiREVWLVwiIDogJyd9JHtwa2cubmFtZX1gLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IHBrZy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHZlcnNpb246IHBrZy52ZXJzaW9uLFxuICAgICAgICAgICAgJ2NvbnRlbnRfc2VjdXJpdHlfcG9saWN5JzogYHNjcmlwdC1zcmMgJ3NlbGYnJHtERVZfRU5WID8gXCIgJ3Vuc2FmZS1ldmFsJ1wiIDogJyd9OyBvYmplY3Qtc3JjICdzZWxmJ2AsXG4gICAgICAgICAgICAuLi5KU09OLnBhcnNlKGNvbnRlbnQudG9TdHJpbmcoKSlcbiAgICAgICAgfSkpXG4gICAgfV0pLFxuXG4gICAgbmV3IEh0bWxXZWJwYWNrUGx1Z2luKHtcbiAgICAgICAgdGVtcGxhdGU6IGAke3BhdGhzLnNyY30vcG9wdXAuaHRtbGAsXG4gICAgICAgIGZpbGVuYW1lOiAncG9wdXAuaHRtbCcsXG4gICAgICAgIGNodW5rczogWydwb3B1cCddXG4gICAgfSksXG5cbiAgICBuZXcgSHRtbFdlYnBhY2tQbHVnaW4oe1xuICAgICAgICB0ZW1wbGF0ZTogYCR7cGF0aHMuc3JjfS9vcHRpb25zLmh0bWxgLFxuICAgICAgICBmaWxlbmFtZTogJ29wdGlvbnMuaHRtbCcsXG4gICAgICAgIGNodW5rczogWydvcHRpb25zJ11cbiAgICB9KSxcblxuICAgIG5ldyBIdG1sV2VicGFja1BsdWdpbih7XG4gICAgICAgIHRlbXBsYXRlOiBgJHtwYXRocy5zcmN9L2JhY2tncm91bmQuaHRtbGAsXG4gICAgICAgIGZpbGVuYW1lOiAnYmFja2dyb3VuZC5odG1sJyxcbiAgICAgICAgY2h1bmtzOiBbJ2JhY2tncm91bmQnXVxuICAgIH0pLFxuXG4gICAgbmV3IFdyaXRlRmlsZVdlYnBhY2tQbHVnaW4oKVxuXTtcblxuLy8gPyBTZWU6IGh0dHBzOi8vd2VicGFjay5qcy5vcmcvY29uZmlndXJhdGlvbi9kZXZ0b29sXG5pZihOT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JylcbiAgICBvcHRpb25zLmRldnRvb2wgPSAnY2hlYXAtbW9kdWxlLWV2YWwtc291cmNlLW1hcCc7XG5cbmNvbnN0IGV4Y2x1ZGUgPSBwYXJzZUdpdElnbm9yZShyZWFkRmlsZVN5bmMocGF0aHMuYnVpbGRHaXRJZ25vcmUpKVxuICAgIC5maWx0ZXIocGF0aCA9PiBwYXRoLnN0YXJ0c1dpdGgoJyEnKSlcbiAgICAubWFwKHBhdGggPT4gcGF0aC5zdWJzdHIoMSkpO1xuXG4vLyA/IFRoaXMgZm9sbG93aW5nIGlzIG5lY2Vzc2FyeSBzbyBDbGVhbldlYnBhY2tQbHVnaW4gZG9lc24ndCBraWxsIGJ1aWxkLy5naXRpZ25vcmVcbm9wdGlvbnMucGx1Z2lucyA9IFtcbiAgICBuZXcgQ2xlYW5XZWJwYWNrUGx1Z2luKFtwYXRocy5idWlsZF0sIHsgZXhjbHVkZSB9KSxcbiAgICAuLi5vcHRpb25zLnBsdWdpbnNcbl07XG5cbm1vZHVsZS5leHBvcnRzID0gb3B0aW9ucztcbiJdfQ==