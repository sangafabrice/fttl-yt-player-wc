import terser from '@rollup/plugin-terser';
import { string } from "rollup-plugin-string";
import app from "./package.json" with { type: "json" };

export default function (config) {
    const preprocessors = {};
    preprocessors[app.main] = ['rollup'];
    config.set({
        basePath: '.',
        frameworks: ['mocha', 'chai', 'web-components'],
        client: { mocha: { ui: "tdd" } },
        files: [app.main, 'test/*.spec.js', 'test/*.test.html', './node_modules/karma-web-components/framework.js']
            .map(pattern => ({
                pattern,
                watched: true,
                included: false
            })),
        exclude: [],
        preprocessors,
        rollupPreprocessor: {
            output: {
                format: 'umd',
                sourcemap: true,
            },
            plugins: [string({ include: "src/assets/*.*" }), terser()]
        },
        reporters: ['progress'],
        port: 9876,
        plugins: ['karma-*'],
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    });
};