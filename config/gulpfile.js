/* @flow */

// ? To regenerate this file (i.e. if you changed it and want your changes to
// ? be visible), call `npm run regenerate` afterwards

// TODO: make a fork of npm-bump that doesn't suck and then use it in lieu of
// TODO: its predecessor below.

import { readFile } from 'fs'
import { promisify } from 'util'
import gulp from 'gulp'
import tap from 'gulp-tap'
import zip from 'gulp-zip'
import del from 'del'
import log from 'fancy-log'
import parseGitIgnore from 'parse-gitignore'
import { transformSync as babel } from '@babel/core'
import { relative as relPath, join as joinPath } from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
// flow-disable-line
import config from './webpack.config'
// flow-disable-line
import pkg from './package'

require('dotenv').config();

const {
    WEBPACK_PORT,
    DEV_ENDPOINT,
    HASHING_OUTPUT_LENGTH
} = process.env;

const configured = config({ NODE_ENV: process.env.NODE_ENV });

if(typeof WEBPACK_PORT !== 'string')
    throw new TypeError('WEBPACK_PORT is improperly defined. Did you copy dist.env -> .env ?');

if(typeof DEV_ENDPOINT !== 'string')
    throw new TypeError('DEV_ENDPOINT is improperly defined. Did you copy dist.env -> .env ?');

if(typeof HASHING_OUTPUT_LENGTH !== 'string')
    throw new TypeError('HASHING_OUTPUT_LENGTH is improperly defined. Did you copy dist.env -> .env ?');

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

paths.regenTargets = [
    `${paths.configs}/*.js`
];

const CLI_BANNER = `/**
* !!! DO NOT EDIT THIS FILE DIRECTLY !!!
* ! This file has been generated automatically. See the config/*.js version of
* ! this file to make permanent modifications!
*/\n\n`;

const readFileAsync = promisify(readFile);

// * CLEANTYPES

export const cleanTypes = async () => {
    const targets = parseGitIgnore(await readFileAsync(paths.flowTypedGitIgnore));

    log(`Deletion targets @ ${paths.flowTyped}/: "${targets.join('" "')}"`);
    await del(targets, { cwd: paths.flowTyped });
};

cleanTypes.description = `Resets the ${paths.flowTyped} directory to a pristine state`;

// * CLEANBUILD

export const cleanBuild = async () => {
    log(`Deletion targets @ ${paths.build}/*`);
    await del('*', { cwd: paths.build });
};

cleanBuild.description = `Resets the ${paths.build} directory to a pristine state`;

// * REGENERATE

// ? If you change this function, run `npm run regenerate` twice: once to
// ? compile this new function and once again to compile itself with the newly
// ? compiled logic. If there is an error that prevents regeneration, you can
// ? run `npm run generate` then `npm run regenerate` instead.
export const regenerate = () => {
    log(`Regenerating targets: "${paths.regenTargets.join('" "')}"`);

    process.env.BABEL_ENV = 'generator';

    return gulp.src(paths.regenTargets)
        .pipe(tap(file => file.contents = Buffer.from(CLI_BANNER + babel(file.contents.toString(), {
            sourceFileName: relPath(__dirname, file.path)
        }).code)))
        .pipe(gulp.dest('.'));
};

regenerate.description = 'Invokes babel on the files in config, transpiling them into their project root versions';

// * BUILD (production)

export const build = (): Promise<void> => {
    process.env.NODE_ENV = 'production';
    return new Promise(resolve => {
        webpack(configured, (err, stats) => {
            if(err)
            {
                const details = err.details ? `\n\t${err.details}` : '';
                throw `WEBPACK FATAL BUILD ERROR: ${err}${details}`;
            }

            const info = stats.toJson();

            if(stats.hasErrors())
                throw `WEBPACK COMPILATION ERROR: ${info.errors}`;

            if(stats.hasWarnings())
                console.warn(`WEBPACK COMPILATION WARNING: ${info.warnings}`);

            resolve();
        });
    });
};

build.description = 'Yields a production-ready unpacked extension via the build directory';

// * BUNDLE-ZIP

export const bundleZip = async () => {
    await del([`${pkg.name}-*.zip`]).then(() => {
        gulp.src('build/**/*').pipe(zip(`${pkg.name}-${pkg.version}.zip`)).pipe(gulp.dest('.'));
    });
};

bundleZip.description = 'Bundles the build directory into a zip archive for upload to the Chrome Web Store and elsewhere';

// * WPDEVSERV

export const wpdevserv = () => {
    Object.keys(configured.entry).forEach(entryKey => configured.entry[entryKey] = [
        `webpack-dev-server/client?http://${DEV_ENDPOINT}:${DEV_PORT}`,
        'webpack/hot/dev-server'
    ].concat(configured.entry[entryKey]));

    configured.plugins = ([
        new webpack.HotModuleReplacementPlugin(),
        ...(configured.plugins ?? []),
    ]: Array<any>);

    const packer = webpack(configured);
    const server = new WebpackDevServer(packer, {
        disableHostCheck: true,
        hot: true,
        contentBase: joinPath(__dirname, paths.build),
        headers: { 'Access-Control-Allow-Origin': '*' }
    });

    server.listen(DEV_PORT, '0.0.0.0', err => { if(err) throw `WEBPACK DEV SERVER ERROR: ${err}` });
};

wpdevserv.description = 'Launches the Webpack Development Server for testing purposes';
