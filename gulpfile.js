/**
* !!! DO NOT EDIT THIS FILE DIRECTLY !!!
* ! This file has been generated automatically. See the config/*.js version of
* ! this file to make permanent modifications!
*/

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wpdevserv = exports.bundleZip = exports.build = exports.regenerate = exports.cleanBuild = exports.cleanTypes = void 0;

require("source-map-support/register");

var _fs = require("fs");

var _util = require("util");

var _gulp = _interopRequireDefault(require("gulp"));

var _gulpTap = _interopRequireDefault(require("gulp-tap"));

var _gulpZip = _interopRequireDefault(require("gulp-zip"));

var _del = _interopRequireDefault(require("del"));

var _fancyLog = _interopRequireDefault(require("fancy-log"));

var _parseGitignore = _interopRequireDefault(require("parse-gitignore"));

var _core = require("@babel/core");

var _path = require("path");

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _webpack2 = _interopRequireDefault(require("./webpack.config"));

var _package = _interopRequireDefault(require("./package"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const {
  WEBPACK_PORT,
  DEV_ENDPOINT,
  HASHING_OUTPUT_LENGTH
} = process.env;
const configured = (0, _webpack2.default)({
  NODE_ENV: process.env.NODE_ENV
});
if (typeof WEBPACK_PORT !== 'string') throw new TypeError('WEBPACK_PORT is improperly defined. Did you copy dist.env -> .env ?');
if (typeof DEV_ENDPOINT !== 'string') throw new TypeError('DEV_ENDPOINT is improperly defined. Did you copy dist.env -> .env ?');
if (typeof HASHING_OUTPUT_LENGTH !== 'string') throw new TypeError('HASHING_OUTPUT_LENGTH is improperly defined. Did you copy dist.env -> .env ?');
const DEV_PORT = parseInt(WEBPACK_PORT, 10);
const paths = {};
paths.flowTyped = 'flow-typed';
paths.flowTypedGitIgnore = `${paths.flowTyped}/.gitignore`;
paths.build = `build`;
paths.configs = 'config';
paths.packageJson = 'package.json';
paths.launchJson = '.vscode/launch.json';
paths.launchJsonDist = '.vscode/launch.dist.json';
paths.env = '.env';
paths.envDist = 'dist.env';
paths.gitProjectDir = '.git';
paths.gitIgnore = '.gitignore';
paths.packageLockJson = 'package-lock.json';
paths.regenTargets = [`${paths.configs}/*.js`];
const CLI_BANNER = `/**
* !!! DO NOT EDIT THIS FILE DIRECTLY !!!
* ! This file has been generated automatically. See the config/*.js version of
* ! this file to make permanent modifications!
*/\n\n`;
const readFileAsync = (0, _util.promisify)(_fs.readFile);

const cleanTypes = async () => {
  const targets = (0, _parseGitignore.default)((await readFileAsync(paths.flowTypedGitIgnore)));
  (0, _fancyLog.default)(`Deletion targets @ ${paths.flowTyped}/: "${targets.join('" "')}"`);
  await (0, _del.default)(targets, {
    cwd: paths.flowTyped
  });
};

exports.cleanTypes = cleanTypes;
cleanTypes.description = `Resets the ${paths.flowTyped} directory to a pristine state`;

const cleanBuild = async () => {
  (0, _fancyLog.default)(`Deletion targets @ ${paths.build}/*`);
  await (0, _del.default)('*', {
    cwd: paths.build
  });
};

exports.cleanBuild = cleanBuild;
cleanBuild.description = `Resets the ${paths.build} directory to a pristine state`;

const regenerate = () => {
  (0, _fancyLog.default)(`Regenerating targets: "${paths.regenTargets.join('" "')}"`);
  process.env.BABEL_ENV = 'generator';
  return _gulp.default.src(paths.regenTargets).pipe((0, _gulpTap.default)(file => file.contents = Buffer.from(CLI_BANNER + (0, _core.transformSync)(file.contents.toString(), {
    sourceFileName: (0, _path.relative)(__dirname, file.path)
  }).code))).pipe(_gulp.default.dest('.'));
};

exports.regenerate = regenerate;
regenerate.description = 'Invokes babel on the files in config, transpiling them into their project root versions';

const build = () => {
  process.env.NODE_ENV = 'production';
  return new Promise(resolve => {
    (0, _webpack.default)(configured, (err, stats) => {
      if (err) {
        const details = err.details ? `\n\t${err.details}` : '';
        throw `WEBPACK FATAL BUILD ERROR: ${err}${details}`;
      }

      const info = stats.toJson();
      if (stats.hasErrors()) throw `WEBPACK COMPILATION ERROR: ${info.errors}`;
      if (stats.hasWarnings()) console.warn(`WEBPACK COMPILATION WARNING: ${info.warnings}`);
      resolve();
    });
  });
};

exports.build = build;
build.description = 'Yields a production-ready unpacked extension via the build directory';

const bundleZip = async () => {
  await (0, _del.default)([`${_package.default.name}-*.zip`]).then(() => {
    _gulp.default.src('build/**/*').pipe((0, _gulpZip.default)(`${_package.default.name}-${_package.default.version}.zip`)).pipe(_gulp.default.dest('.'));
  });
};

exports.bundleZip = bundleZip;
bundleZip.description = 'Bundles the build directory into a zip archive for upload to the Chrome Web Store and elsewhere';

const wpdevserv = () => {
  var _configured$plugins;

  Object.keys(configured.entry).forEach(entryKey => configured.entry[entryKey] = [`webpack-dev-server/client?http://${DEV_ENDPOINT}:${DEV_PORT}`, 'webpack/hot/dev-server'].concat(configured.entry[entryKey]));
  configured.plugins = [new _webpack.default.HotModuleReplacementPlugin(), ...((_configured$plugins = configured.plugins) !== null && _configured$plugins !== void 0 ? _configured$plugins : [])];
  const packer = (0, _webpack.default)(configured);
  const server = new _webpackDevServer.default(packer, {
    disableHostCheck: true,
    hot: true,
    contentBase: (0, _path.join)(__dirname, paths.build),
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    publicPath: `http://${DEV_ENDPOINT}:${DEV_PORT}/`,
    sockHost: DEV_ENDPOINT,
    sockPort: DEV_PORT
  });
  server.listen(DEV_PORT, '0.0.0.0', err => {
    if (err) throw `WEBPACK DEV SERVER ERROR: ${err}`;
  });
};

exports.wpdevserv = wpdevserv;
wpdevserv.description = 'Launches the Webpack Development Server for testing purposes';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy9ndWxwZmlsZS5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiV0VCUEFDS19QT1JUIiwiREVWX0VORFBPSU5UIiwiSEFTSElOR19PVVRQVVRfTEVOR1RIIiwicHJvY2VzcyIsImVudiIsImNvbmZpZ3VyZWQiLCJOT0RFX0VOViIsIlR5cGVFcnJvciIsIkRFVl9QT1JUIiwicGFyc2VJbnQiLCJwYXRocyIsImZsb3dUeXBlZCIsImZsb3dUeXBlZEdpdElnbm9yZSIsImJ1aWxkIiwiY29uZmlncyIsInBhY2thZ2VKc29uIiwibGF1bmNoSnNvbiIsImxhdW5jaEpzb25EaXN0IiwiZW52RGlzdCIsImdpdFByb2plY3REaXIiLCJnaXRJZ25vcmUiLCJwYWNrYWdlTG9ja0pzb24iLCJyZWdlblRhcmdldHMiLCJDTElfQkFOTkVSIiwicmVhZEZpbGVBc3luYyIsInJlYWRGaWxlIiwiY2xlYW5UeXBlcyIsInRhcmdldHMiLCJqb2luIiwiY3dkIiwiZGVzY3JpcHRpb24iLCJjbGVhbkJ1aWxkIiwicmVnZW5lcmF0ZSIsIkJBQkVMX0VOViIsImd1bHAiLCJzcmMiLCJwaXBlIiwiZmlsZSIsImNvbnRlbnRzIiwiQnVmZmVyIiwiZnJvbSIsInRvU3RyaW5nIiwic291cmNlRmlsZU5hbWUiLCJfX2Rpcm5hbWUiLCJwYXRoIiwiY29kZSIsImRlc3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsImVyciIsInN0YXRzIiwiZGV0YWlscyIsImluZm8iLCJ0b0pzb24iLCJoYXNFcnJvcnMiLCJlcnJvcnMiLCJoYXNXYXJuaW5ncyIsImNvbnNvbGUiLCJ3YXJuIiwid2FybmluZ3MiLCJidW5kbGVaaXAiLCJwa2ciLCJuYW1lIiwidGhlbiIsInZlcnNpb24iLCJ3cGRldnNlcnYiLCJPYmplY3QiLCJrZXlzIiwiZW50cnkiLCJmb3JFYWNoIiwiZW50cnlLZXkiLCJjb25jYXQiLCJwbHVnaW5zIiwid2VicGFjayIsIkhvdE1vZHVsZVJlcGxhY2VtZW50UGx1Z2luIiwicGFja2VyIiwic2VydmVyIiwiV2VicGFja0RldlNlcnZlciIsImRpc2FibGVIb3N0Q2hlY2siLCJob3QiLCJjb250ZW50QmFzZSIsImhlYWRlcnMiLCJwdWJsaWNQYXRoIiwic29ja0hvc3QiLCJzb2NrUG9ydCIsImxpc3RlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBUUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRUE7Ozs7QUFFQUEsT0FBTyxDQUFDLFFBQUQsQ0FBUCxDQUFrQkMsTUFBbEI7O0FBRUEsTUFBTTtBQUNGQyxFQUFBQSxZQURFO0FBRUZDLEVBQUFBLFlBRkU7QUFHRkMsRUFBQUE7QUFIRSxJQUlGQyxPQUFPLENBQUNDLEdBSlo7QUFNQSxNQUFNQyxVQUFVLEdBQUcsdUJBQU87QUFBRUMsRUFBQUEsUUFBUSxFQUFFSCxPQUFPLENBQUNDLEdBQVIsQ0FBWUU7QUFBeEIsQ0FBUCxDQUFuQjtBQUVBLElBQUcsT0FBT04sWUFBUCxLQUF3QixRQUEzQixFQUNJLE1BQU0sSUFBSU8sU0FBSixDQUFjLHFFQUFkLENBQU47QUFFSixJQUFHLE9BQU9OLFlBQVAsS0FBd0IsUUFBM0IsRUFDSSxNQUFNLElBQUlNLFNBQUosQ0FBYyxxRUFBZCxDQUFOO0FBRUosSUFBRyxPQUFPTCxxQkFBUCxLQUFpQyxRQUFwQyxFQUNJLE1BQU0sSUFBSUssU0FBSixDQUFjLDhFQUFkLENBQU47QUFFSixNQUFNQyxRQUFRLEdBQUdDLFFBQVEsQ0FBQ1QsWUFBRCxFQUFlLEVBQWYsQ0FBekI7QUFFQSxNQUFNVSxLQUFLLEdBQUcsRUFBZDtBQUVBQSxLQUFLLENBQUNDLFNBQU4sR0FBa0IsWUFBbEI7QUFDQUQsS0FBSyxDQUFDRSxrQkFBTixHQUE0QixHQUFFRixLQUFLLENBQUNDLFNBQVUsYUFBOUM7QUFDQUQsS0FBSyxDQUFDRyxLQUFOLEdBQWUsT0FBZjtBQUNBSCxLQUFLLENBQUNJLE9BQU4sR0FBZ0IsUUFBaEI7QUFD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QSxVQUFVLENBQUNtRSxPQUFYLEdBQXNCLENBQ2xCLElBQUlDLGlCQUFRQywwQkFBWixFQURrQixFQUVsQiwyQkFBSXJFLFVBQVUsQ0FBQ21FLE9BQWYscUVBQTBCLEVBQTFCLENBRmtCLENBQXRCO0FBS0EsUUFBTUcsTUFBTSxHQUFHLHNCQUFRdEUsVUFBUixDQUFmO0FBQ0EsUUFBTXVFLE1BQU0sR0FBRyxJQUFJQyx5QkFBSixDQUFxQkYsTUFBckIsRUFBNkI7QUFDeENHLElBQUFBLGdCQUFnQixFQUFFLElBRHNCO0FBRXhDQyxJQUFBQSxHQUFHLEVBQUUsSUFGbUM7QUFHeENDLElBQUFBLFdBQVcsRUFBRSxnQkFBU3JDLFNBQVQsRUFBb0JqQyxLQUFLLENBQUNHLEtBQTFCLENBSDJCO0FBSXhDb0UsSUFBQUEsT0FBTyxFQUFFO0FBQUUscUNBQStCO0FBQWpDLEtBSitCO0FBS3hDQyxJQUFBQSxVQUFVLEVBQUcsVUFBU2pGLFlBQWEsSUFBR08sUUFBUyxHQUxQO0FBTXhDMkUsSUFBQUEsUUFBUSxFQUFFbEYsWUFOOEI7QUFPeENtRixJQUFBQSxRQUFRLEVBQUU1RTtBQVA4QixHQUE3QixDQUFmO0FBVUFvRSxFQUFBQSxNQUFNLENBQUNTLE1BQVAsQ0FBYzdFLFFBQWQsRUFBd0IsU0FBeEIsRUFBbUN5QyxHQUFHLElBQUk7QUFBRSxRQUFHQSxHQUFILEVBQVEsTUFBTyw2QkFBNEJBLEdBQUksRUFBdkM7QUFBMEMsR0FBOUY7QUFDSCxDQXZCTTs7O0FBeUJQZ0IsU0FBUyxDQUFDbkMsV0FBVixHQUF3Qiw4REFBeEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG4vLyA/IFRvIHJlZ2VuZXJhdGUgdGhpcyBmaWxlIChpLmUuIGlmIHlvdSBjaGFuZ2VkIGl0IGFuZCB3YW50IHlvdXIgY2hhbmdlcyB0b1xuLy8gPyBiZSB2aXNpYmxlKSwgY2FsbCBgbnBtIHJ1biByZWdlbmVyYXRlYCBhZnRlcndhcmRzXG5cbi8vIFRPRE86IG1ha2UgYSBmb3JrIG9mIG5wbS1idW1wIHRoYXQgZG9lc24ndCBzdWNrIGFuZCB0aGVuIHVzZSBpdCBpbiBsaWV1IG9mXG4vLyBUT0RPOiBpdHMgcHJlZGVjZXNzb3IgYmVsb3cuXG5cbmltcG9ydCB7IHJlYWRGaWxlIH0gZnJvbSAnZnMnXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJ1xuaW1wb3J0IGd1bHAgZnJvbSAnZ3VscCdcbmltcG9ydCB0YXAgZnJvbSAnZ3VscC10YXAnXG5pbXBvcnQgemlwIGZyb20gJ2d1bHAtemlwJ1xuaW1wb3J0IGRlbCBmcm9tICdkZWwnXG5pbXBvcnQgbG9nIGZyb20gJ2ZhbmN5LWxvZydcbmltcG9ydCBwYXJzZUdpdElnbm9yZSBmcm9tICdwYXJzZS1naXRpZ25vcmUnXG5pbXBvcnQgeyB0cmFuc2Zvcm1TeW5jIGFzIGJhYmVsIH0gZnJvbSAnQGJhYmVsL2NvcmUnXG5pbXBvcnQgeyByZWxhdGl2ZSBhcyByZWxQYXRoLCBqb2luIGFzIGpvaW5QYXRoIH0gZnJvbSAncGF0aCdcbmltcG9ydCB3ZWJwYWNrIGZyb20gJ3dlYnBhY2snXG5pbXBvcnQgV2VicGFja0RldlNlcnZlciBmcm9tICd3ZWJwYWNrLWRldi1zZXJ2ZXInXG4vLyBmbG93LWRpc2FibGUtbGluZVxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL3dlYnBhY2suY29uZmlnJ1xuLy8gZmxvdy1kaXNhYmxlLWxpbmVcbmltcG9ydCBwa2cgZnJvbSAnLi9wYWNrYWdlJ1xuXG5yZXF1aXJlKCdkb3RlbnYnKS5jb25maWcoKTtcblxuY29uc3Qge1xuICAgIFdFQlBBQ0tfUE9SVCxcbiAgICBERVZfRU5EUE9JTlQsXG4gICAgSEFTSElOR19PVVRQVVRfTEVOR1RIXG59ID0gcHJvY2Vzcy5lbnY7XG5cbmNvbnN0IGNvbmZpZ3VyZWQgPSBjb25maWcoeyBOT0RFX0VOVjogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfSk7XG5cbmlmKHR5cGVvZiBXRUJQQUNLX1BPUlQgIT09ICdzdHJpbmcnKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1dFQlBBQ0tfUE9SVCBpcyBpbXByb3Blcmx5IGRlZmluZWQuIERpZCB5b3UgY29weSBkaXN0LmVudiAtPiAuZW52ID8nKTtcblxuaWYodHlwZW9mIERFVl9FTkRQT0lOVCAhPT0gJ3N0cmluZycpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignREVWX0VORFBPSU5UIGlzIGltcHJvcGVybHkgZGVmaW5lZC4gRGlkIHlvdSBjb3B5IGRpc3QuZW52IC0+IC5lbnYgPycpO1xuXG5pZih0eXBlb2YgSEFTSElOR19PVVRQVVRfTEVOR1RIICE9PSAnc3RyaW5nJylcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIQVNISU5HX09VVFBVVF9MRU5HVEggaXMgaW1wcm9wZXJseSBkZWZpbmVkLiBEaWQgeW91IGNvcHkgZGlzdC5lbnYgLT4gLmVudiA/Jyk7XG5cbmNvbnN0IERFVl9QT1JUID0gcGFyc2VJbnQoV0VCUEFDS19QT1JULCAxMCk7XG5cbmNvbnN0IHBhdGhzID0ge307XG5cbnBhdGhzLmZsb3dUeXBlZCA9ICdmbG93LXR5cGVkJztcbnBhdGhzLmZsb3dUeXBlZEdpdElnbm9yZSA9IGAke3BhdGhzLmZsb3dUeXBlZH0vLmdpdGlnbm9yZWA7XG5wYXRocy5idWlsZCA9IGBidWlsZGA7XG5wYXRocy5jb25maWdzID0gJ2NvbmZpZyc7XG5wYXRocy5wYWNrYWdlSnNvbiA9ICdwYWNrYWdlLmpzb24nO1xucGF0aHMubGF1bmNoSnNvbiA9ICcudnNjb2RlL2xhdW5jaC5qc29uJztcbnBhdGhzLmxhdW5jaEpzb25EaXN0ID0gJy52c2NvZGUvbGF1bmNoLmRpc3QuanNvbic7XG5wYXRocy5lbnYgPSAnLmVudic7XG5wYXRocy5lbnZEaXN0ID0gJ2Rpc3QuZW52JztcbnBhdGhzLmdpdFByb2plY3REaXIgPSAnLmdpdCc7XG5wYXRocy5naXRJZ25vcmUgPSAnLmdpdGlnbm9yZSc7XG5wYXRocy5wYWNrYWdlTG9ja0pzb24gPSAncGFja2FnZS1sb2NrLmpzb24nO1xuXG5wYXRocy5yZWdlblRhcmdldHMgPSBbXG4gICAgYCR7cGF0aHMuY29uZmlnc30vKi5qc2Bcbl07XG5cbmNvbnN0IENMSV9CQU5ORVIgPSBgLyoqXG4qICEhISBETyBOT1QgRURJVCBUSElTIEZJTEUgRElSRUNUTFkgISEhXG4qICEgVGhpcyBmaWxlIGhhcyBiZWVuIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5LiBTZWUgdGhlIGNvbmZpZy8qLmpzIHZlcnNpb24gb2ZcbiogISB0aGlzIGZpbGUgdG8gbWFrZSBwZXJtYW5lbnQgbW9kaWZpY2F0aW9ucyFcbiovXFxuXFxuYDtcblxuY29uc3QgcmVhZEZpbGVBc3luYyA9IHByb21pc2lmeShyZWFkRmlsZSk7XG5cbi8vICogQ0xFQU5UWVBFU1xuXG5leHBvcnQgY29uc3QgY2xlYW5UeXBlcyA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0YXJnZXRzID0gcGFyc2VHaXRJZ25vcmUoYXdhaXQgcmVhZEZpbGVBc3luYyhwYXRocy5mbG93VHlwZWRHaXRJZ25vcmUpKTtcblxuICAgIGxvZyhgRGVsZXRpb24gdGFyZ2V0cyBAICR7cGF0aHMuZmxvd1R5cGVkfS86IFwiJHt0YXJnZXRzLmpvaW4oJ1wiIFwiJyl9XCJgKTtcbiAgICBhd2FpdCBkZWwodGFyZ2V0cywgeyBjd2Q6IHBhdGhzLmZsb3dUeXBlZCB9KTtcbn07XG5cbmNsZWFuVHlwZXMuZGVzY3JpcHRpb24gPSBgUmVzZXRzIHRoZSAke3BhdGhzLmZsb3dUeXBlZH0gZGlyZWN0b3J5IHRvIGEgcHJpc3RpbmUgc3RhdGVgO1xuXG4vLyAqIENMRUFOQlVJTERcblxuZXhwb3J0IGNvbnN0IGNsZWFuQnVpbGQgPSBhc3luYyAoKSA9PiB7XG4gICAgbG9nKGBEZWxldGlvbiB0YXJnZXRzIEAgJHtwYXRocy5idWlsZH0vKmApO1xuICAgIGF3YWl0IGRlbCgnKicsIHsgY3dkOiBwYXRocy5idWlsZCB9KTtcbn07XG5cbmNsZWFuQnVpbGQuZGVzY3JpcHRpb24gPSBgUmVzZXRzIHRoZSAke3BhdGhzLmJ1aWxkfSBkaXJlY3RvcnkgdG8gYSBwcmlzdGluZSBzdGF0ZWA7XG5cbi8vICogUkVHRU5FUkFURVxuXG4vLyA/IElmIHlvdSBjaGFuZ2UgdGhpcyBmdW5jdGlvbiwgcnVuIGBucG0gcnVuIHJlZ2VuZXJhdGVgIHR3aWNlOiBvbmNlIHRvXG4vLyA/IGNvbXBpbGUgdGhpcyBuZXcgZnVuY3Rpb24gYW5kIG9uY2UgYWdhaW4gdG8gY29tcGlsZSBpdHNlbGYgd2l0aCB0aGUgbmV3bHlcbi8vID8gY29tcGlsZWQgbG9naWMuIElmIHRoZXJlIGlzIGFuIGVycm9yIHRoYXQgcHJldmVudHMgcmVnZW5lcmF0aW9uLCB5b3UgY2FuXG4vLyA/IHJ1biBgbnBtIHJ1biBnZW5lcmF0ZWAgdGhlbiBgbnBtIHJ1biByZWdlbmVyYXRlYCBpbnN0ZWFkLlxuZXhwb3J0IGNvbnN0IHJlZ2VuZXJhdGUgPSAoKSA9PiB7XG4gICAgbG9nKGBSZWdlbmVyYXRpbmcgdGFyZ2V0czogXCIke3BhdGhzLnJlZ2VuVGFyZ2V0cy5qb2luKCdcIiBcIicpfVwiYCk7XG5cbiAgICBwcm9jZXNzLmVudi5CQUJFTF9FTlYgPSAnZ2VuZXJhdG9yJztcblxuICAgIHJldHVybiBndWxwLnNyYyhwYXRocy5yZWdlblRhcmdldHMpXG4gICAgICAgIC5waXBlKHRhcChmaWxlID0+IGZpbGUuY29udGVudHMgPSBCdWZmZXIuZnJvbShDTElfQkFOTkVSICsgYmFiZWwoZmlsZS5jb250ZW50cy50b1N0cmluZygpLCB7XG4gICAgICAgICAgICBzb3VyY2VGaWxlTmFtZTogcmVsUGF0aChfX2Rpcm5hbWUsIGZpbGUucGF0aClcbiAgICAgICAgfSkuY29kZSkpKVxuICAgICAgICAucGlwZShndWxwLmRlc3QoJy4nKSk7XG59O1xuXG5yZWdlbmVyYXRlLmRlc2NyaXB0aW9uID0gJ0ludm9rZXMgYmFiZWwgb24gdGhlIGZpbGVzIGluIGNvbmZpZywgdHJhbnNwaWxpbmcgdGhlbSBpbnRvIHRoZWlyIHByb2plY3Qgcm9vdCB2ZXJzaW9ucyc7XG5cbi8vICogQlVJTEQgKHByb2R1Y3Rpb24pXG5cbmV4cG9ydCBjb25zdCBidWlsZCA9ICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9ICdwcm9kdWN0aW9uJztcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIHdlYnBhY2soY29uZmlndXJlZCwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgICAgIGlmKGVycilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXRhaWxzID0gZXJyLmRldGFpbHMgPyBgXFxuXFx0JHtlcnIuZGV0YWlsc31gIDogJyc7XG4gICAgICAgICAgICAgICAgdGhyb3cgYFdFQlBBQ0sgRkFUQUwgQlVJTEQgRVJST1I6ICR7ZXJyfSR7ZGV0YWlsc31gO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpbmZvID0gc3RhdHMudG9Kc29uKCk7XG5cbiAgICAgICAgICAgIGlmKHN0YXRzLmhhc0Vycm9ycygpKVxuICAgICAgICAgICAgICAgIHRocm93IGBXRUJQQUNLIENPTVBJTEFUSU9OIEVSUk9SOiAke2luZm8uZXJyb3JzfWA7XG5cbiAgICAgICAgICAgIGlmKHN0YXRzLmhhc1dhcm5pbmdzKCkpXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBXRUJQQUNLIENPTVBJTEFUSU9OIFdBUk5JTkc6ICR7aW5mby53YXJuaW5nc31gKTtcblxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbmJ1aWxkLmRlc2NyaXB0aW9uID0gJ1lpZWxkcyBhIHByb2R1Y3Rpb24tcmVhZHkgdW5wYWNrZWQgZXh0ZW5zaW9uIHZpYSB0aGUgYnVpbGQgZGlyZWN0b3J5JztcblxuLy8gKiBCVU5ETEUtWklQXG5cbmV4cG9ydCBjb25zdCBidW5kbGVaaXAgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgZGVsKFtgJHtwa2cubmFtZX0tKi56aXBgXSkudGhlbigoKSA9PiB7XG4gICAgICAgIGd1bHAuc3JjKCdidWlsZC8qKi8qJykucGlwZSh6aXAoYCR7cGtnLm5hbWV9LSR7cGtnLnZlcnNpb259LnppcGApKS5waXBlKGd1bHAuZGVzdCgnLicpKTtcbiAgICB9KTtcbn07XG5cbmJ1bmRsZVppcC5kZXNjcmlwdGlvbiA9ICdCdW5kbGVzIHRoZSBidWlsZCBkaXJlY3RvcnkgaW50byBhIHppcCBhcmNoaXZlIGZvciB1cGxvYWQgdG8gdGhlIENocm9tZSBXZWIgU3RvcmUgYW5kIGVsc2V3aGVyZSc7XG5cbi8vICogV1BERVZTRVJWXG5cbmV4cG9ydCBjb25zdCB3cGRldnNlcnYgPSAoKSA9PiB7XG4gICAgT2JqZWN0LmtleXMoY29uZmlndXJlZC5lbnRyeSkuZm9yRWFjaChlbnRyeUtleSA9PiBjb25maWd1cmVkLmVudHJ5W2VudHJ5S2V5XSA9IFtcbiAgICAgICAgYHdlYnBhY2stZGV2LXNlcnZlci9jbGllbnQ/aHR0cDovLyR7REVWX0VORFBPSU5UfToke0RFVl9QT1JUfWAsXG4gICAgICAgICd3ZWJwYWNrL2hvdC9kZXYtc2VydmVyJ1xuICAgIF0uY29uY2F0KGNvbmZpZ3VyZWQuZW50cnlbZW50cnlLZXldKSk7XG5cbiAgICBjb25maWd1cmVkLnBsdWdpbnMgPSAoW1xuICAgICAgICBuZXcgd2VicGFjay5Ib3RNb2R1bGVSZXBsYWNlbWVudFBsdWdpbigpLFxuICAgICAgICAuLi4oY29uZmlndXJlZC5wbHVnaW5zID8/IFtdKSxcbiAgICBdOiBBcnJheTxhbnk+KTtcblxuICAgIGNvbnN0IHBhY2tlciA9IHdlYnBhY2soY29uZmlndXJlZCk7XG4gICAgY29uc3Qgc2VydmVyID0gbmV3IFdlYnBhY2tEZXZTZXJ2ZXIocGFja2VyLCB7XG4gICAgICAgIGRpc2FibGVIb3N0Q2hlY2s6IHRydWUsXG4gICAgICAgIGhvdDogdHJ1ZSxcbiAgICAgICAgY29udGVudEJhc2U6IGpvaW5QYXRoKF9fZGlybmFtZSwgcGF0aHMuYnVpbGQpLFxuICAgICAgICBoZWFkZXJzOiB7ICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicgfSxcbiAgICAgICAgcHVibGljUGF0aDogYGh0dHA6Ly8ke0RFVl9FTkRQT0lOVH06JHtERVZfUE9SVH0vYCxcbiAgICAgICAgc29ja0hvc3Q6IERFVl9FTkRQT0lOVCxcbiAgICAgICAgc29ja1BvcnQ6IERFVl9QT1JUXG4gICAgfSk7XG5cbiAgICBzZXJ2ZXIubGlzdGVuKERFVl9QT1JULCAnMC4wLjAuMCcsIGVyciA9PiB7IGlmKGVycikgdGhyb3cgYFdFQlBBQ0sgREVWIFNFUlZFUiBFUlJPUjogJHtlcnJ9YCB9KTtcbn07XG5cbndwZGV2c2Vydi5kZXNjcmlwdGlvbiA9ICdMYXVuY2hlcyB0aGUgV2VicGFjayBEZXZlbG9wbWVudCBTZXJ2ZXIgZm9yIHRlc3RpbmcgcHVycG9zZXMnO1xuIl19