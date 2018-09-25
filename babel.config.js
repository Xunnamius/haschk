const sourceMapPlugin = 'babel-plugin-source-map-support';
const sourceMapValue = 'inline';

module.exports = {
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-proposal-throw-expressions',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining'
    ],
    presets: [
        ['@babel/preset-env', {
            targets: 'last 2 chrome versions'
        }],
        ['@babel/preset-flow']
    ],
    env: {
        production: {},
        debug: {},
        development: {
            // ? Handled by Webpack
            /*sourceMaps: sourceMapValue,
            plugins: [sourceMapPlugin],*/
        },
        generator: {
            sourceMaps: sourceMapValue,
            plugins: [sourceMapPlugin],
            comments: false,
            presets: [
                ['@babel/preset-env', {
                    targets: {
                        node: true
                    }
                }]
            ]
        }
    }
};
