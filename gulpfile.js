var gulp = require('gulp');
var chalk = require('chalk');
var rollup = require('rollup');

var fs = require('fs');
var spawn = require('child_process').spawn;


// Rollup plugins
var babel = require('rollup-plugin-babel');
var eslint = require('rollup-plugin-eslint');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var typescript = require('rollup-plugin-typescript');

// Config Options
var publishDest = 'build/pixi-stick.js';
var devDest = 'docs/dist/pixi-stick.js';

var options = {
    cache: cache,
    entry: 'src/index.ts',
    external: ['pixi.js'],
    plugins: [
        typescript(),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs(),
        // eslint({
        //     exclude: [
        //         'src/styles/**',
        //     ]
        // })
        // ,
        babel({
            exclude: 'node_modules/**',
        })
    ],
};



/************************/
/**  Publishing Tasks  **/
/************************/
gulp.task('publish', function () {
    console.log('Building for publishing')
    return rollup.rollup(options)
        .then(function (bundle) {
            return bundle.write({
                dest: publishDest,
                format: 'umd',
                moduleName: 'PixiStick',
                globals: {
                    'pixi.js': 'PIXI'
                }
            });
        });
});



/***********************/
/** Development Tasks **/
/***********************/
var cache;
gulp.task('compile-dev', function (cb) {
    console.log('Building for dev')
    return rollup.rollup(options)
        .then(function (bundle) {
            cache = bundle;

            return bundle.write({
                dest: devDest,
                format: 'umd',
                moduleName: 'PixiStick',
                globals: {
                    'pixi.js': 'PIXI'
                }
            });
        });
});

var serverProcess;
gulp.task('dev', ['compile-dev'], function () {
    if (!serverProcess) {
        console.log('Starting WebServer...');
        serverProcess = spawn('node', ['./static.js']);
        serverProcess.stdout.on('data', function (data) {
            console.log(chalk.cyan('[WebServer]: ' + data));
        });
        serverProcess.stderr.on('data', function (data) {
            console.error(chalk.red('[WebServer]: ' + data));
        });
    }

    gulp.watch('src/**/*.ts*', ['compile-dev']);
    gulp.watch('node_modules/pixi.js/bin/*.js', ['compile-dev']);
})



/********************/
/**  Default Task  **/
/********************/
gulp.task('default', ['publish'], function () {
});









