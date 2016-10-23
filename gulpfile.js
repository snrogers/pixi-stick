const gulp = require('gulp');
const chalk = require('chalk');
const rollup = require('rollup');
const insert = require('gulp-insert');

const fs = require('fs');
const spawn = require('child_process').spawn;


// Rollup plugins
const babel = require('rollup-plugin-babel');
const eslint = require('rollup-plugin-eslint');
const typescript = require('rollup-plugin-typescript');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

// Config Options
const es6Dest = 'build/pixi-stick.es2015.js';
const es5Dest = 'build/pixi-stick.js';
const devDest = 'docs/dist/pixi-stick.js';

const publishOptionsEs6 = {
    entry: 'src/index.ts',
    external: ['pixi.js'],
    plugins: [
        typescript({
            typescript: require('typescript')
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs(),
        babel({
            presets: [
                [
                    "es2015",
                    {
                        "modules": false
                    }
                ]
            ],
            exclude: 'node_modules/**',
        })
    ],
};

const publishOptionsEs5 = {
    entry: 'src/index.ts',
    external: ['pixi.js'],
    plugins: [
        typescript({
            typescript: require('typescript')
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs(),
        babel({
            presets: [
                [
                    "es2015",
                    {
                        "modules": false
                    }
                ]
            ],
            exclude: 'node_modules/**',
        })
    ],
};

let cache;
const DevOptions = {
    cache: cache,
    entry: 'src/index.ts',
    external: ['pixi.js'],
    plugins: [
        typescript({
            typescript: require('typescript')
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs(),
        babel({
            presets: [
                [
                    "es2015",
                    {
                        "modules": false
                    }
                ]
            ],
            exclude: 'node_modules/**',
        })
    ],
};




/************************/
/**  Publishing Tasks  **/
/************************/
gulp.task('publish-es6', function () {
    console.log('Building for publishing')
    return rollup.rollup(publishOptionsEs6)
        .then(function (bundle) {
            return bundle.write({
                dest: es6Dest,
                format: 'es',
                sourceMap: 'true',
                moduleName: 'PixiStick',
                globals: {
                    'pixi.js': 'PIXI'
                }
            });
        })
        .then(function () {
            // Prepend a check for window.PIXI 
            return gulp.src(es6Dest)
                .pipe(insert.prepend(`if (this === window && !window.PIXI){
    throw new Error('PIXI not found! If you are using PixiStick without bundling (i.e. loading pixi-stick.js via <script> tags), ensure that pixi-stick.js is loaded AFTER pixi.js ');
}\n
`)).pipe(gulp.dest('./build'));
        });
});

gulp.task('publish-es5', function () {
    console.log('Building for publishing')
    return rollup.rollup(publishOptionsEs5)
        .then(function (bundle) {
            return bundle.write({
                dest: es5Dest,
                format: 'umd',
                sourceMap: 'true',
                moduleName: 'PixiStick',
                globals: {
                    'pixi.js': 'PIXI'
                }
            });
        })
        .then(function () {
            // Prepend a check for window.PIXI 
            return gulp.src(es5Dest)
                .pipe(insert.prepend(`if (this === window && !window.PIXI){
    throw new Error('PIXI not found! If you are using PixiStick without bundling (i.e. loading pixi-stick.js via <script> tags), ensure that pixi-stick.js is loaded AFTER pixi.js ');
}\n
`)).pipe(gulp.dest('./build'));
        });
});




/***********************/
/** Development Tasks **/
/***********************/
gulp.task('compile-dev', function (cb) {
    console.log('Building for dev')
    return rollup.rollup(DevOptions)
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
        })

        // Prepend a check for window.PIXI 
        .then(function () {
            return gulp.src(devDest)
                .pipe(insert.prepend(`if (this === window && !window.PIXI){
    throw new Error('PIXI not found! If you are using PixiStick without bundling (i.e. loading pixi-stick.js via <script> tags), ensure that pixi-stick.js is loaded AFTER pixi.js ');
}\n
`)).pipe(gulp.dest('./docs/dist'));
        });
});


let serverProcess;
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
gulp.task('default', ['publish-es6', 'publish-es5'], function () { });

gulp.task('all', ['publish-es6', 'publish-es5', 'compile-dev'], function () { });









