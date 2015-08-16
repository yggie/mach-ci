'use strict';

// Karma configuration
// Generated on Sun Mar 08 2015 13:00:21 GMT+0000 (GMT)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'specs/spec-helper.js',
      'bower_components/threejs/build/three.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/react/react.js',
      'client/javascript/**/*.jsx',
      'specs/extensions/**/*.js',
      'specs/**/*-spec.js'
    ],


    // list of files to exclude
    exclude: [
      'client/javascript/run.jsx'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'client/javascript/**/*.jsx': ['browserify'],
      'specs/**/*.js': ['browserify']
    },


    browserify: {
      debug: true,
      transform: [['babelify', { stage: 0 }]]
    },


    notifyReporter: {
      reportEachFailure: false,
      reportSuccess: true
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'notify'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
