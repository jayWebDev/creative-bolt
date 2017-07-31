var gulp = require('gulp');
var stylus = require('gulp-stylus');
var pug = require('gulp-pug');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var cp = require('child_process');

gulp.task('jekyll-build', function(code){
  return cp.spawn('jekyll', ['build', '--incremental'], { stdio: 'inherit' })
    .on('error', function(error) { gutil.log(gutil.colors.red(error.message))})
    .on('close', code);
})

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
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
  runSequence(['views','styles'],'jekyll-build','watch',cb);
});

gulp.task('styles-seq', function(cb) {
  runSequence('styles','jekyll-rebuild',cb);
});

gulp.task('views-seq', function(cb) {
  runSequence('views','jekyll-rebuild',cb);
});

gulp.task('watch', ['browser-sync', 'styles', 'views'], function() {
  gulp.watch('src/pug/*.pug', ['views-seq']);
  gulp.watch('src/stylus/*.styl', ['styles-seq']);
});
