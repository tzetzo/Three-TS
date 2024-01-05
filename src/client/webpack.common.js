
const path = require('path')

module.exports = {
    entry: './src/client/client.mts',
    module: {
        rules: [
            {
                test: /\.m?t?j?sx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.mts'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../../dist/client'),
    },
}
