var path = require('path');
var webpack = require('webpack');


console.log('****************************');
console.log('From webpack.config.js: ');
console.log(path.join(__dirname, 'src/'));
console.log('****************************');

module.exports = {
    dev: {
        devtool: 'source-map',
        entry: ['./src/index.ts', 'pixi.js'],
        output: {
            filename: 'build/PixiStick.js'
        },
        resolve: {
            extensions: ["", '.ts', ".js"]
        },
        externals: {},
        module: {
            postLoaders: [{
                loader: "transform?brfs"
            }],
            loaders: [
                // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
                {
                    test: /\.ts?$/,
                    loader: "ts-loader"
                }
            ],
            preLoaders: [
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                {
                    test: /\.js$/,
                    loader: "source-map-loader"
                }
            ]
        }
    },
    devOld: {
        entry: {
            PixiStick: "./src/index.ts"
        },
        output: {
            filename: "./docs/dist/pixi-stick.js",
            library: "PixiStick",
            libraryTarget: "umd",
            umdNamedDefine: true
        },

        // Enable sourcemaps for debugging webpack's output.
        resolve: {
            extensions: ['', '.ts', '.js']
        },

        // Source maps support ('inline-source-map' also works)
        // devtool: 'source-map',

        // Add the loader for .ts files.
        module: {
            loaders: [{
                test: /\.ts$/,
                loader: 'ts-loader'
            }]
        },
        externals: { 'pixi.js': 'PIXI' },
    },
    publish: {
        entry: {
            PixiStick: "./src/index.ts"
        },
        output: {
            filename: "./dist/pixi-stick.js",
            library: "PixiStick",
            libraryTarget: "umd",
            umdNamedDefine: true
        },

        // Enable sourcemaps for debugging webpack's output.
        devtool: "source-map",

        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: ["", ".webpack.js", ".web.js", ".ts", ".js"]
        },

        module: {
            loaders: [
                // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
                {
                    test: /\.ts?$/,
                    loader: "ts-loader"
                }
            ],
            preLoaders: [
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                {
                    test: /\.js$/,
                    loader: "source-map-loader"
                }
            ]
        },
        externals: { 'pixi.js': 'PIXI' },
    }
};