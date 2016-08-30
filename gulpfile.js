'use strict';
const gulp = require("gulp");
const gutil = require("gulp-util");

const webpack = require("webpack");
const ts = require('gulp-typescript');
const sourceMaps = require('gulp-sourcemaps');

const webpackConfigPublish = require('./webpack.config.js').publish;
const webpackConfigDev = require('./webpack.config.js').dev;

const spawn = require('child_process').spawn;
const chalk = require('chalk');
const rimraf = require('rimraf');
const deleteLines = require('gulp-delete-lines');
const gulpConcat = require('gulp-concat');

const devCompiler = webpack(webpackConfigDev);
const publishCompiler = webpack(webpackConfigPublish);
let serverProcess;


/***********************/
/** Development Tasks **/
/***********************/
gulp.task("webpack-dev", function(cb) {
    devCompiler.run(function(err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack-dev]", stats.toString({
            // output options
        }));
        cb();
    });
});


gulp.task('compile-dev', ['webpack-dev'], function(cb) {
    rimraf('./src/*.d.ts', {}, function() {
        cb()
    });
});

gulp.task('dev', ['compile-dev'], function(cb) {
    if (!serverProcess) {
        console.log('Starting WebServer...');
        serverProcess = spawn('node', ['./static.js']);
        serverProcess.stdout.on('data', function(data) {
            console.log(chalk.cyan('[WebServer]: ' + data));
        });
        serverProcess.stderr.on('data', function(data) {
            console.error(chalk.red('[WebServer]: ' + data));
        });
    }

    gulp.watch('src/**/*.ts*', ['compile-dev']);

});


/************************/
/**  Publishing Tasks  **/
/************************/
gulp.task("webpack-publish", function(cb) {
    publishCompiler.run(function(err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack-publish]", stats.toString({
            // output options
        }));
        cb();
    });
});

gulp.task('compile-publish', ['webpack-publish'], function(cb) {
    return gulp.src("./src/*.d.ts")
        // .pipe(deleteLines({
        //     'filters': [
        //         /^import/
        //     ]
        // }))
        // .pipe(gulpConcat('pixi-stick.d.ts'))
        .pipe(gulp.dest('./dist'));
})

gulp.task('publish', ['compile-publish'], function(cb) {
    rimraf('./src/*.d.ts', {}, function() {
        cb();
    });
});



gulp.task('default', ['publish'], function() {})