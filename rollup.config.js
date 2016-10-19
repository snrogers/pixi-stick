// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';

export default {
    entry: 'src/index.ts',
    dest: 'build/pixi-stick.js',
    format: 'umd',
    moduleName: 'PixiStick',
    external: ['pixi.js'],
    globals: {
        'pixi.js': 'PIXI'
    },
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