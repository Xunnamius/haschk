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
        ['@babel/preset-flow']
    ],
    env: {
        production: {},
        development: {
            sourceMaps: sourceMapValue,
            plugins: [sourceMapPlugin],
        },
        debug: {
            sourceMaps: sourceMapValue,
            plugins: [sourceMapPlugin],
        },
        generator: {
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
