/* @flow */

// flow-disable-line
import pkg from './package'
import webpack from 'webpack'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WriteFileWebpackPlugin from 'write-file-webpack-plugin'

require('dotenv').config();

const { NODE_ENV } = process.env;
const DEV_ENV = NODE_ENV === 'development';

const paths = {};

paths.src = `${__dirname}/src`;
paths.build = `${__dirname}/build`;
paths.srcManifest = `${paths.src}/manifest.json`;
paths.components = `${paths.src}/components`;

const assetExtensions = ['jpg', 'jpeg', 'png', `gif`, "eot", 'otf', 'svg', 'ttf', 'woff', 'woff2'];

// * Webpack configuration options

const options: Object = {};

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
        }
    ]
};

options.plugins = [
    // ? Clean paths.build
    new CleanWebpackPlugin(['build']),

    // ? Expose desired environment variables in the packed bundle
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
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

if(NODE_ENV === 'development')
    options.devtool = 'cheap-module-eval-source-map';

module.exports = options;
