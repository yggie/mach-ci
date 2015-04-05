/* global __dirname:false */

(function (require, __dirname) {
  'use strict';

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
      config = {
        paths: {
          base: __dirname + '/client',
          javascript: __dirname + '/client/javascript',
          styles: __dirname + '/client/stylesheets',
          dist: __dirname + '/public/assets'
        },
      };


  var clientDependencies = gulp.src([
    'bower_components/threejs/build/three.js',
    'bower_components/react/react.js',
  ]);


  var compileSass = lazypipe()
    .pipe(sass)
    .pipe(autoprefixer, {
      browsers: ['last 2 versions', 'Firefox ESR'],
      cascade: true,
      remove: true,
    });


  var compileJsx = function (options) {
    return through2.obj(function (file, enc, next) {
      browserify(file.path, options)
        .transform(babelify.configure({
          sourceMapRelative: config.paths.base,
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


  gulp.task('build', function () {
    var css = gulp.src(config.paths.styles + '/**/*.scss', {
        base: config.paths.base
      })
      .pipe(compileSass())
      .pipe(minifyCss());

    var jsx = gulp.src(config.paths.javascript + '/application.jsx', {
        base: config.paths.base
      })
      .pipe(compileJsx());

    var js = merge(clientDependencies, jsx)
      .pipe(concat('javascript/application.js'))
      .pipe(uglify());

    return merge(css, js)
      .pipe(addMinExtension())
      .pipe(gulp.dest(config.paths.dist));
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
    var jsx = gulp.src(config.paths.javascript + '/application.jsx', {
        base: config.paths.base
      })
      .pipe(compileJsx({ debug: true }))
      .on('error', notify.onError());

    return merge(clientDependencies, jsx)
      .pipe(concat('javascript/application.js'))
      .pipe(gulp.dest(config.paths.dist))
      .pipe(notify({ message: 'Successfully compiled .jsx files' }));
  });


  gulp.task('watch', function () {
    gulp.watch([config.paths.javascript + '/**/*.jsx'], ['compile-jsx']);
    gulp.watch([config.paths.styles + '/**/*.scss'], ['compile-sass']);
  });


  gulp.task('default', ['compile-sass', 'compile-jsx'], function () {
    gulp.start('watch');
  });
}).call(this, require, __dirname);
