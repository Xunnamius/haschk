/**
* !!! DO NOT EDIT THIS FILE DIRECTLY !!!
* ! This file has been generated automatically. See the config/*.js version of
* ! this file to make permanent modifications!
*/

"use strict";

require("source-map-support/register");

var _package = _interopRequireDefault(require("./package"));

var _webpack = _interopRequireDefault(require("webpack"));

var _cleanWebpackPlugin = require("clean-webpack-plugin");

var _copyWebpackPlugin = _interopRequireDefault(require("copy-webpack-plugin"));

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _writeFileWebpackPlugin = _interopRequireDefault(require("write-file-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const {
  HASHING_ALGORITHM,
  APPLICATION_LABEL
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
  NODE_ENV = NODE_ENV || 'production';
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
    _NODE_ENV: JSON.stringify(NODE_ENV),
    _HASHING_ALGORITHM: JSON.stringify(HASHING_ALGORITHM || 'SHA-256'),
    _APPLICATION_LABEL: JSON.stringify(APPLICATION_LABEL || '_haschk')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy93ZWJwYWNrLmNvbmZpZy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiSEFTSElOR19BTEdPUklUSE0iLCJBUFBMSUNBVElPTl9MQUJFTCIsInByb2Nlc3MiLCJlbnYiLCJwYXRocyIsInNyYyIsIl9fZGlybmFtZSIsImdpdElnbm9yZSIsImJ1aWxkIiwiYnVpbGRBc3NldHMiLCJtYW5pZmVzdCIsImNvbXBvbmVudHMiLCJ1bml2ZXJzZSIsImFzc2V0cyIsImFzc2V0RXh0ZW5zaW9ucyIsImNvbmZpZ3VyZSIsIk5PREVfRU5WIiwiREVWX0VOViIsIm9wdGlvbnMiLCJtb2RlIiwiZW50cnkiLCJiYWNrZ3JvdW5kIiwicG9wdXAiLCJvdXRwdXQiLCJwYXRoIiwiZmlsZW5hbWUiLCJtb2R1bGUiLCJydWxlcyIsInRlc3QiLCJsb2FkZXIiLCJleGNsdWRlIiwiUmVnRXhwIiwiam9pbiIsInBsdWdpbnMiLCJDbGVhbldlYnBhY2tQbHVnaW4iLCJ3ZWJwYWNrIiwiRGVmaW5lUGx1Z2luIiwiX05PREVfRU5WIiwiSlNPTiIsInN0cmluZ2lmeSIsIl9IQVNISU5HX0FMR09SSVRITSIsIl9BUFBMSUNBVElPTl9MQUJFTCIsIkNvcHlXZWJwYWNrUGx1Z2luIiwiZnJvbSIsInRyYW5zZm9ybSIsImNvbnRlbnQiLCJCdWZmZXIiLCJuYW1lIiwicGtnIiwiZGVzY3JpcHRpb24iLCJ2ZXJzaW9uIiwicGFyc2UiLCJ0b1N0cmluZyIsInRvIiwiSHRtbFdlYnBhY2tQbHVnaW4iLCJ0ZW1wbGF0ZSIsImNodW5rcyIsIldyaXRlRmlsZVdlYnBhY2tQbHVnaW4iLCJyZXNvbHZlIiwiYWxpYXMiLCJkZXZ0b29sIiwibWFpbkZpZWxkcyIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFHQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBQSxPQUFPLENBQUMsUUFBRCxDQUFQLENBQWtCQyxNQUFsQjs7QUFFQSxNQUFNO0FBQUVDLEVB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QUFELElBQWdDWSxTQUFTLENBQUNaLEdBQUcsQ0FBQ2EsUUFBTCxDQUExRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbi8vIGZsb3ctZGlzYWJsZS1saW5lXG5pbXBvcnQgcGtnIGZyb20gJy4vcGFja2FnZSdcbmltcG9ydCB3ZWJwYWNrIGZyb20gJ3dlYnBhY2snXG5pbXBvcnQgeyBDbGVhbldlYnBhY2tQbHVnaW4gfSBmcm9tICdjbGVhbi13ZWJwYWNrLXBsdWdpbidcbmltcG9ydCBDb3B5V2VicGFja1BsdWdpbiBmcm9tICdjb3B5LXdlYnBhY2stcGx1Z2luJ1xuaW1wb3J0IEh0bWxXZWJwYWNrUGx1Z2luIGZyb20gJ2h0bWwtd2VicGFjay1wbHVnaW4nXG5pbXBvcnQgV3JpdGVGaWxlV2VicGFja1BsdWdpbiBmcm9tICd3cml0ZS1maWxlLXdlYnBhY2stcGx1Z2luJ1xuXG5yZXF1aXJlKCdkb3RlbnYnKS5jb25maWcoKTtcblxuY29uc3QgeyBIQVNISU5HX0FMR09SSVRITSwgQVBQTElDQVRJT05fTEFCRUwgfSA9IHByb2Nlc3MuZW52O1xuXG5jb25zdCBwYXRocyA9IHt9O1xuXG5wYXRocy5zcmMgPSBgJHtfX2Rpcm5hbWV9L3NyY2A7XG5wYXRocy5naXRJZ25vcmUgPSBgJHtfX2Rpcm5hbWV9Ly5naXRpZ25vcmVgO1xucGF0aHMuYnVpbGQgPSBgJHtfX2Rpcm5hbWV9L2J1aWxkYDtcbnBhdGhzLmJ1aWxkQXNzZXRzID0gYCR7cGF0aHMuYnVpbGR9L2Fzc2V0c2A7XG5wYXRocy5tYW5pZmVzdCA9IGAke3BhdGhzLnNyY30vbWFuaWZlc3QuanNvbmA7XG5wYXRocy5jb21wb25lbnRzID0gYCR7cGF0aHMuc3JjfS9jb21wb25lbnRzYDtcbnBhdGhzLnVuaXZlcnNlID0gYCR7cGF0aHMuc3JjfS91bml2ZXJzZWA7XG5wYXRocy5hc3NldHMgPSBgJHtwYXRocy5zcmN9L2Fzc2V0c2A7XG5cbmNvbnN0IGFzc2V0RXh0ZW5zaW9ucyA9IFsnanBnJywgJ2pwZWcnLCAncG5nJywgYGdpZmAsIFwiZW90XCIsICdvdGYnLCAnc3ZnJywgJ3R0ZicsICd3b2ZmJywgJ3dvZmYyJ107XG5cbmNvbnN0IGNvbmZpZ3VyZSA9IChOT0RFX0VOVjogP3N0cmluZykgPT4ge1xuICAgIE5PREVfRU5WID0gTk9ERV9FTlYgfHwgJ3Byb2R1Y3Rpb24nO1xuXG4gICAgY29uc3QgREVWX0VOViA9IE5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuICAgIG9wdGlvbnMubW9kZSA9IERFVl9FTlYgPyAnZGV2ZWxvcG1lbnQnIDogJ3Byb2R1Y3Rpb24nO1xuXG4gICAgb3B0aW9ucy5lbnRyeSA9IHtcbiAgICAgICAgYmFja2dyb3VuZDogW2Ake3BhdGhzLmNvbXBvbmVudHN9L2JhY2tncm91bmQvaW5kZXguanNgXSxcbiAgICAgICAgb3B0aW9uczogW2Ake3BhdGhzLmNvbXBvbmVudHN9L29wdGlvbnMvaW5kZXguanNgXSxcbiAgICAgICAgcG9wdXA6IFtgJHtwYXRocy5jb21wb25lbnRzfS9wb3B1cC9pbmRleC5qc2BdLFxuICAgIH07XG5cbiAgICBvcHRpb25zLm91dHB1dCA9IHtcbiAgICAgICAgcGF0aDogcGF0aHMuYnVpbGQsXG4gICAgICAgIGZpbGVuYW1lOiAnW25hbWVdLnBhY2tlZC5qcydcbiAgICB9O1xuXG4gICAgb3B0aW9ucy5tb2R1bGUgPSB7XG4gICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGVzdDogL1xcLmNzcyQvLFxuICAgICAgICAgICAgICAgIGxvYWRlcjogJ3N0eWxlLWxvYWRlciFjc3MtbG9hZGVyJyxcbiAgICAgICAgICAgICAgICBleGNsdWRlOiAvbm9kZV9tb2R1bGVzL1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXN0OiBuZXcgUmVnRXhwKGBcXFxcLigke2Fzc2V0RXh0ZW5zaW9ucy5qb2luKCd8Jyl9KSRgKSxcbiAgICAgICAgICAgICAgICBsb2FkZXI6ICdmaWxlLWxvYWRlcj9uYW1lPVtuYW1lXS5bZXh0XScsXG4gICAgICAgICAgICAgICAgZXhjbHVkZTogL25vZGVfbW9kdWxlcy9cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGVzdDogL1xcLmh0bWwkLyxcbiAgICAgICAgICAgICAgICBsb2FkZXI6ICdodG1sLWxvYWRlcicsXG4gICAgICAgICAgICAgICAgZXhjbHVkZTogL25vZGVfbW9kdWxlcy9cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGVzdDogL1xcLmpzJC8sXG4gICAgICAgICAgICAgICAgbG9hZGVyOiAnYmFiZWwtbG9hZGVyP2NhY2hlRGlyZWN0b3J5JyxcbiAgICAgICAgICAgICAgICBleGNsdWRlOiAvbm9kZV9tb2R1bGVzL1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfTtcblxuICAgIG9wdGlvbnMucGx1Z2lucyA9IFtcbiAgICAgICAgLy8gPyBDbGVhbiBwYXRocy5idWlsZCAoYWRkZWQgYmVsb3cgaW5zdGVhZClcbiAgICAgICAgbmV3IENsZWFuV2VicGFja1BsdWdpbigpLFxuXG4gICAgICAgIC8vID8gRXhwb3NlIGRlc2lyZWQgZW52aXJvbm1lbnQgdmFyaWFibGVzIGluIHRoZSBwYWNrZWQgYnVuZGxlXG4gICAgICAgIG5ldyB3ZWJwYWNrLkRlZmluZVBsdWdpbih7XG4gICAgICAgICAgICBfTk9ERV9FTlY6IEpTT04uc3RyaW5naWZ5KE5PREVfRU5WKSxcbiAgICAgICAgICAgIF9IQVNISU5HX0FMR09SSVRITTogSlNPTi5zdHJpbmdpZnkoSEFTSElOR19BTEdPUklUSE0gfHwgJ1NIQS0yNTYnKSxcbiAgICAgICAgICAgIF9BUFBMSUNBVElPTl9MQUJFTDogSlNPTi5zdHJpbmdpZnkoQVBQTElDQVRJT05fTEFCRUwgfHwgJ19oYXNjaGsnKVxuICAgICAgICB9KSxcblxuICAgICAgICBuZXcgQ29weVdlYnBhY2tQbHVnaW4oW3tcbiAgICAgICAgICAgIGZyb206IHBhdGhzLm1hbmlmZXN0LFxuXG4gICAgICAgICAgICAvLyA/IEdlbmVyYXRlcyBvdXIgbWFuaWZlc3QgZmlsZSB1c2luZyBpbmZvIGZyb20gcGFja2FnZS5qc29uXG4gICAgICAgICAgICB0cmFuc2Zvcm06IGNvbnRlbnQgPT4gQnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIG5hbWU6IGAke0RFVl9FTlYgPyBcIkRFVi1cIiA6ICcnfSR7cGtnLm5hbWV9YCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogcGtnLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHBrZy52ZXJzaW9uLFxuICAgICAgICAgICAgICAgICdjb250ZW50X3NlY3VyaXR5X3BvbGljeSc6IGBzY3JpcHQtc3JjICdzZWxmJyR7REVWX0VOViA/IFwiICd1bnNhZmUtZXZhbCdcIiA6ICcnfTsgb2JqZWN0LXNyYyAnc2VsZidgLFxuICAgICAgICAgICAgICAgIC4uLkpTT04ucGFyc2UoY29udGVudC50b1N0cmluZygpKVxuICAgICAgICAgICAgfSkpXG4gICAgICAgIH1dKSxcblxuICAgICAgICBuZXcgQ29weVdlYnBhY2tQbHVnaW4oW3tcbiAgICAgICAgICAgIGZyb206IGAke3BhdGhzLmFzc2V0c30vaWNvbi8qKi8qLnBuZ2AsXG4gICAgICAgICAgICB0bzogYCR7cGF0aHMuYnVpbGRBc3NldHN9L2ljb24vWzFdYCxcbiAgICAgICAgICAgIHRlc3Q6IC8uKlxcL2ljb25cXC8oLiopJC9cbiAgICAgICAgfV0pLFxuXG4gICAgICAgIG5ldyBIdG1sV2VicGFja1BsdWdpbih7XG4gICAgICAgICAgICB0ZW1wbGF0ZTogYCR7cGF0aHMuc3JjfS9wb3B1cC5odG1sYCxcbiAgICAgICAgICAgIGZpbGVuYW1lOiAncG9wdXAuaHRtbCcsXG4gICAgICAgICAgICBjaHVua3M6IFsncG9wdXAnXVxuICAgICAgICB9KSxcblxuICAgICAgICBuZXcgSHRtbFdlYnBhY2tQbHVnaW4oe1xuICAgICAgICAgICAgdGVtcGxhdGU6IGAke3BhdGhzLnNyY30vb3B0aW9ucy5odG1sYCxcbiAgICAgICAgICAgIGZpbGVuYW1lOiAnb3B0aW9ucy5odG1sJyxcbiAgICAgICAgICAgIGNodW5rczogWydvcHRpb25zJ11cbiAgICAgICAgfSksXG5cbiAgICAgICAgbmV3IEh0bWxXZWJwYWNrUGx1Z2luKHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiBgJHtwYXRocy5zcmN9L2JhY2tncm91bmQuaHRtbGAsXG4gICAgICAgICAgICBmaWxlbmFtZTogJ2JhY2tncm91bmQuaHRtbCcsXG4gICAgICAgICAgICBjaHVua3M6IFsnYmFja2dyb3VuZCddXG4gICAgICAgIH0pLFxuXG4gICAgICAgIG5ldyBIdG1sV2VicGFja1BsdWdpbih7XG4gICAgICAgICAgICB0ZW1wbGF0ZTogYCR7cGF0aHMuc3JjfS93ZWxjb21lLmh0bWxgLFxuICAgICAgICAgICAgZmlsZW5hbWU6ICd3ZWxjb21lLmh0bWwnXG4gICAgICAgIH0pLFxuXG4gICAgICAgIG5ldyBXcml0ZUZpbGVXZWJwYWNrUGx1Z2luKClcbiAgICBdO1xuXG4gICAgb3B0aW9ucy5yZXNvbHZlID0ge307XG5cbiAgICAvLyA/IFRoZXNlIGFyZSBhbGlhc2VzIHRoYXQgY2FuIGJlIHVzZWQgZHVyaW5nIEpTIGltcG9ydCBjYWxsc1xuICAgIC8vICEgTm90ZSB0aGF0IHlvdSBtdXN0IGFsc28gY2hhbmdlIHRoZXNlIHNhbWUgYWxpYXNlcyBpbiAuZmxvd2NvbmZpZ1xuICAgIC8vICEgTm90ZSB0aGF0IHlvdSBtdXN0IGFsc28gY2hhbmdlIHRoZXNlIHNhbWUgYWxpYXNlcyBpbiBwYWNrYWdlLmpzb24gKGplc3QpXG4gICAgb3B0aW9ucy5yZXNvbHZlLmFsaWFzID0ge1xuICAgICAgICAnY29tcG9uZW50cyc6IHBhdGhzLmNvbXBvbmVudHMsXG4gICAgICAgICd1bml2ZXJzZSc6IHBhdGhzLnVuaXZlcnNlXG4gICAgfTtcblxuICAgIC8vID8gU2VlOiBodHRwczovL3dlYnBhY2suanMub3JnL2NvbmZpZ3VyYXRpb24vZGV2dG9vbFxuICAgIGlmKERFVl9FTlYpXG4gICAgICAgIG9wdGlvbnMuZGV2dG9vbCA9ICdjaGVhcC1tb2R1bGUtZXZhbC1zb3VyY2UtbWFwJztcblxuICAgIGlmKE5PREVfRU5WICE9PSAnZ2VuZXJhdG9yJylcbiAgICB7XG4gICAgICAgIC8vID8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vaXBmcy9qcy1pcGZzLWFwaS9wdWxsLzc3N1xuICAgICAgICBvcHRpb25zLnJlc29sdmUubWFpbkZpZWxkcyA9IFsnYnJvd3NlcicsICdtYWluJ107XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IChlbnY6IHsgTk9ERV9FTlY6ID9zdHJpbmcgfSkgPT4gY29uZmlndXJlKGVudi5OT0RFX0VOVik7XG4iXX0=