var path = require('path');
var webpack = require('webpack');


console.log('****************************');
console.log('From webpack.config.js: ');
console.log(path.join(__dirname, 'src/'));
console.log('****************************');

module.exports = {
    dev: {
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
            extensions: ['', '.ts', '.tsx', '.js', '.jsx']
        },

        // Source maps support ('inline-source-map' also works)
        // devtool: 'source-map',

        // Add the loader for .ts files.
        module: {
            loaders: [{
                test: /\.ts$/,
                loader: 'ts-loader'
            }]
        }
    },
    "dev-old": {
        entry: {
            PixiStick: "./src/index.ts"
        },
        output: {
            filename: "./test/dist/pixi-stick.js",
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

        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        externals: {},
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

        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        externals: {},
    }
    // ,
    // client: {
    //     entry: {
    //         PixiStick: "./src/index.ts"
    //     },
    //     output: {
    //         filename: "./test/dist/pixi-stick.js",
    //         library: "PixiStick",
    //         libraryTarget: "umd",
    //         umdNamedDefine: true
    //     },

    //     // Enable sourcemaps for debugging webpack's output.
    //     // devtool: "source-map",

    //     resolve: {
    //         // Add '.ts' and '.tsx' as resolvable extensions.
    //         extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    //     },

    //     module: {
    //         loaders: [
    //                 // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
    //                 {
    //                     test: /\.tsx?$/,
    //                     loader: "ts-loader"
    //                 }
    //             ]
    //             // ,

    //         // preLoaders: [
    //         //     // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
    //         //     {
    //         //         test: /\.js$/,
    //         //         loader: "source-map-loader"
    //         //     }
    //         // ]
    //     },

    //     // When importing a module whose path matches one of the following, just
    //     // assume a corresponding global variable exists and use that instead.
    //     // This is important because it allows us to avoid bundling all of our
    //     // dependencies, which allows browsers to cache those libraries between builds.
    //     externals: {
    //         "react": "React",
    //         "react-dom": "ReactDOM"
    //     },
    // }
};