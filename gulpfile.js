var gulp = require('gulp');
var stylus = require('gulp-stylus');
var pug = require('gulp-pug');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var exec = require('child_process').exec;

gulp.task('jekyll-build', function(cb) {
  exec('jekyll build', function(err) {
    if (err) return cb(err); // return error
    cb();
  });
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: '_site'
    },
    browser: 'google chrome'
  });
});

gulp.task('views', function() {
  return gulp.src('src/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('_includes'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('styles', function() {
  return gulp.src('src/stylus/main.styl')
    .pipe(stylus())
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('default', function(cb) {
  runSequence(['views','styles'],'jekyll-build',cb);
});

gulp.task('watch', ['browser-sync', 'styles', 'views'], function() {
  gulp.watch('src/pug/*.pug', ['views']);
  gulp.watch('src/stylus/*.styl', ['styles']);
});
