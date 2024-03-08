const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, '../../dist/client'),
        },
        hot: true,
        open: true, // auto opens a browser tab
        // port: 3000, // localhost:3000
        headers: { 'Content-Encoding': 'none' }, // makes the webpack dev server return the Header `Content-Length` which is used by the `xhr.total` to calculate the loading progress of our 3D models inside the `onProgress` callback
        proxy: {
            '/socket.io': {
                target: 'http://127.0.0.1:5000',
                ws: true,
            },
        },
    },
})
