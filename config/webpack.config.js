/* @flow */

// flow-disable-line
import pkg from './package'
import webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WriteFileWebpackPlugin from 'write-file-webpack-plugin'

require('dotenv').config();

const {
    URN_PREFIX,
    HASHING_ALGORITHM,
    APPLICATION_LABEL,
    MAX_REQUEST_HISTORY,
    BASE32_URN_LENGTH,
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

const configure = (NODE_ENV: ?string) => {
    NODE_ENV = NODE_ENV || 'production';

    const DEV_ENV = NODE_ENV === 'development';
    const options = {};

    options.mode = DEV_ENV ? 'development' : 'production';

    options.entry = {
        background: [`${paths.components}/background/index.js`],
        options: [`${paths.components}/options/index.js`],
        popup: [`${paths.components}/popup/index.js`],
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
        // ? Clean paths.build (added below instead)
        new CleanWebpackPlugin(),

        // ? Expose desired environment variables in the packed bundle
        new webpack.DefinePlugin({
            _NODE_ENV: JSON.stringify(NODE_ENV),
            _HASHING_ALGORITHM: JSON.stringify(HASHING_ALGORITHM || 'SHA-256'),
            _APPLICATION_LABEL: JSON.stringify(APPLICATION_LABEL || '_haschk'),
            _MAX_REQUEST_HISTORY: JSON.stringify(MAX_REQUEST_HISTORY || 1000),
            _BASE32_URN_LENGTH: JSON.stringify(BASE32_URN_LENGTH || 112),
            _URN_PREFIX: JSON.stringify(URN_PREFIX || '::::'),
        }),

        new CopyWebpackPlugin([{
            from: paths.manifest,

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

        new HtmlWebpackPlugin({
            template: `${paths.src}/welcome.html`,
            filename: 'welcome.html',
            chunks: []
        }),

        new WriteFileWebpackPlugin()
    ];

    options.resolve = {};

    // ? These are aliases that can be used during JS import calls
    // ! Note that you must also change these same aliases in .flowconfig
    // ! Note that you must also change these same aliases in package.json (jest)
    options.resolve.alias = {
        'components': paths.components,
        'universe': paths.universe
    };

    // ? See: https://webpack.js.org/configuration/devtool
    if(DEV_ENV)
        options.devtool = 'cheap-module-eval-source-map';

    if(NODE_ENV !== 'generator')
    {
        // ? See: https://github.com/ipfs/js-ipfs-api/pull/777
        options.resolve.mainFields = ['browser', 'main'];
    }

    return options;
};

module.exports = (env: { NODE_ENV: ?string }) => configure(env.NODE_ENV);
