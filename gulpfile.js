/* global __dirname:false */

'use strict';

(function (require, __dirname) {
  var gulp = require('gulp'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      browserify = require('browserify'),
      babelify = require('babelify'),
      notify = require('gulp-notify'),
      autoprefixer = require('gulp-autoprefixer'),
      lazypipe = require('lazypipe'),
      through2 = require('through2'),
      uglify = require('gulp-uglify'),
      minifyCss = require('gulp-minify-css'),
      concat = require('gulp-concat'),
      merge = require('merge-stream'),
      gulpFilter = require('gulp-filter'),
      inject = require('gulp-inject'),
      path = require('path');


  var config = {
        paths: {
          base: path.join(__dirname, '/client'),
          javascript: path.join(__dirname, '/client/javascript'),
          styles: path.join(__dirname, '/client/stylesheets'),
          public: path.join(__dirname, '/public'),
          dist: path.join(__dirname, '/public/assets'),
          build: path.join(__dirname, '/mach-test-browser-standalone/public')
        }
      };


  var clientDependencies = function () {
    return gulp.src([
      'bower_components/jquery/dist/jquery.js',
      'bower_components/threejs/build/three.js',
      'bower_components/react/react.js',
      'bower_components/classnames/index.js'
    ]);
  };


  var compileSass = lazypipe()
    .pipe(sass)
    .pipe(autoprefixer, {
      browsers: ['last 2 versions', 'Firefox ESR'],
      cascade: true,
      remove: true
    });


  var compileJsx = function (options) {
    return through2.obj(function (file, enc, next) {
      browserify(file.path, options)
        .transform(babelify.configure({
          stage: 0,
        }))
        .bundle(function (err, res) {
          if (err) {
            return next(err);
          }

          file.contents = res;
          file.path = file.path.replace(/.jsx$/, '.js');
          next(null, file);
        });
    });
  };


  var addMinExtension = function () {
    return through2.obj(function (file, enc, next) {
      file.path = file.path.replace(/\.[^\.]+$/, function (match) {
        return '.min' + match;
      });
      next(null, file);
    });
  };


  gulp.task('build-assets', function () {
    return gulp.src([
      '!' + config.paths['public'] + '/**/application.css*',
      config.paths['public'] + '/**/*.{css,jpg,svg,eot,otf,ttf,woff,woff2}'
    ])
      .pipe(gulp.dest(config.paths.build));
  });


  gulp.task('minify-css-and-js', function () {
    var css = gulp.src(config.paths.base + '/stylesheets/**/*.scss')
      .pipe(compileSass())
      .pipe(minifyCss());

    var jsx = gulp.src(config.paths.base + '/javascript/run.jsx', {
        base: config.paths.base
      })
      .pipe(compileJsx());

    var js = merge(clientDependencies(), jsx)
      .pipe(concat('application.js'))
      .pipe(uglify());

    return merge(css, js)
      .pipe(addMinExtension())
      .pipe(gulp.dest(config.paths.build));
  });


  gulp.task('build', ['minify-css-and-js', 'build-assets'], function () {
    return gulp.src(config.paths['public'] + '/index.html')
      .pipe(inject(gulp.src([
        config.paths.build + '/**/*.js',
        config.paths.build + '/**/*.css'
      ], { cwd: config.paths.build + '/' })))
      .pipe(gulp.dest(config.paths.build));
  });


  gulp.task('compile-sass', function () {
    return gulp.src(config.paths.styles + '/**/*.scss', {
        base: config.paths.base
      })
      .pipe(sourcemaps.init())
      .pipe(compileSass())
      .on('error', notify.onError())
      .on('error', function () {
        this.emit('end');
      })
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.paths.dist))
      .pipe(notify({ message: 'Successfully compiled .scss files' }));
  });


  gulp.task('compile-jsx', function () {
    var jsx = gulp.src(config.paths.javascript + '/run.jsx', {
        base: config.paths.base
      });

    var filter = gulpFilter(['**/*.jsx']);

    return merge(clientDependencies(), jsx)
      .pipe(filter)
        .pipe(compileJsx({ debug: true }))
        .on('error', notify.onError())
      .pipe(filter.restore())
      .pipe(sourcemaps.init())
      .pipe(concat('javascript/application.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.paths.dist))
      .pipe(notify({ message: 'Successfully compiled .jsx files' }));
  });


  gulp.task('watch', function () {
    gulp.watch([config.paths.javascript + '/**/*.jsx', config.paths.javascript + '/**/*.js'], ['compile-jsx']);
    gulp.watch([config.paths.styles + '/**/*.scss'], ['compile-sass']);
  });


  gulp.task('default', ['compile-sass', 'compile-jsx'], function () {
    gulp.start('watch');
  });
}).call(this, require, __dirname);
