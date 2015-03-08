(function (require) {
  'use strict';

  var gulp = require('gulp'),
      usemin = require('gulp-usemin'),
      sourcemaps = require('gulp-sourcemaps'),
      babel = require('gulp-babel'),
      concat = require('gulp-concat'),
      less = require('gulp-less'),
      config = {
        paths: {
          src: './src',
          styles: './styles',
          dist: './dist',
        },
      };


  gulp.task('compile-less', function () {
    return gulp.src(config.paths.styles + '/**/*.less')
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(concat('app.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.paths.dist));
  });


  gulp.task('compile-js', function () {
    return gulp.src(config.paths.src + '/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat('app.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.paths.dist));
  });


  gulp.task('build', ['compile-js'], function () {
    return gulp.src('./index-template.html')
      .pipe(concat('index.html.template'))
      .pipe(usemin())
      .pipe(gulp.dest('dist/'));
  });


  gulp.task('watch', function () {
    gulp.watch([config.paths.src + '/**/*.js'], ['compile-js']);
    gulp.watch([config.paths.styles + '/**/*.less'], ['compile-less']);
  });


  gulp.task('default', ['compile-less', 'compile-js'], function () {
    gulp.start('watch');
  });

}).call(this, require);
