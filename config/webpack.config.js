/* @flow */

// flow-disable-line
import pkg from './package'
import webpack from 'webpack'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WriteFileWebpackPlugin from 'write-file-webpack-plugin'
import parseGitIgnore from 'parse-gitignore'
import { readFileSync } from 'fs'

require('dotenv').config();

const { NODE_ENV, HASHING_ALGORITHM, HASHING_OUTPUT_LENGTH } = process.env;
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

// * Webpack configuration options

const options: Object = {};

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
    rules: [
        {
            test: /\.css$/,
            loader: 'style-loader!css-loader',
            exclude: /node_modules/
        },
        {
            test: new RegExp(`\\.(${assetExtensions.join('|')})$`),
            loader: 'file-loader?name=[name].[ext]',
            exclude: /node_modules/
        },
        {
            test: /\.html$/,
            loader: 'html-loader',
            exclude: /node_modules/
        },
        {
            test: /\.js$/,
            loader: 'babel-loader?cacheDirectory',
            exclude: /node_modules/
        }
    ]
};

options.plugins = [
    // ? Clean paths.build (see below)
    // new CleanWebpackPlugin(['build']),

    // ? Expose desired environment variables in the packed bundle
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(NODE_ENV),
            HASHING_ALGORITHM: JSON.stringify(HASHING_ALGORITHM),
            HASHING_OUTPUT_LENGTH: JSON.stringify(HASHING_OUTPUT_LENGTH),
        },
    }),

    new CopyWebpackPlugin([{
        from: paths.srcManifest,

        // ? Generates our manifest file using info from package.json
        transform: content => Buffer.from(JSON.stringify({
            name: `${DEV_ENV ? "DEV-" : ''}${pkg.name}`,
            description: pkg.description,
            version: pkg.version,
            'content_security_policy': `script-src 'self'${DEV_ENV ? " 'unsafe-eval'" : ''}; object-src 'self'`,
            ...JSON.parse(content.toString())
        }))
    }]),

    new CopyWebpackPlugin([{
        from: `${paths.assets}/icon/**/*.png`,
        to: `${paths.buildAssets}/icon/[1]`,
        test: /.*\/icon\/(.*)$/
    }]),

    new HtmlWebpackPlugin({
        template: `${paths.src}/popup.html`,
        filename: 'popup.html',
        chunks: ['popup']
    }),

    new HtmlWebpackPlugin({
        template: `${paths.src}/options.html`,
        filename: 'options.html',
        chunks: ['options']
    }),

    new HtmlWebpackPlugin({
        template: `${paths.src}/background.html`,
        filename: 'background.html',
        chunks: ['background']
    }),

    new WriteFileWebpackPlugin()
];

options.resolve = {};

// ? These are aliases that can be used during JS import calls
// ! Note that you must also change these same aliases in .flowconfig
// ! Note that you must also change these same aliases in package.json (jest)
options.resolve.alias = {
    'universe': `${__dirname}/src/universe/`
};

// ? See: https://webpack.js.org/configuration/devtool
if(DEV_ENV)
    options.devtool = 'cheap-module-eval-source-map';

if(NODE_ENV !== 'generator')
{
    // ? See: https://github.com/ipfs/js-ipfs-api/pull/777
    options.resolve.mainFields = ['browser', 'main'];
}

const exclude = parseGitIgnore(readFileSync(paths.buildGitIgnore))
    .filter(path => path.startsWith('!'))
    .map(path => path.substr(1));

// ? This following is necessary so CleanWebpackPlugin doesn't kill build/.gitignore
options.plugins = [
    new CleanWebpackPlugin([paths.build], { exclude }),
    ...options.plugins
];

module.exports = options;
