var gulp = require('gulp');

var browserSync = require('browser-sync').create();
var cache = require('gulp-cache');
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  });
});

// call to clear caches off local system
gulp.task('cache:clear', function(cb) {
  return cache.clearAll(cb);
});

// delete dist folder
// doesnt delete cached image folder
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('useref', function() {
  return gulp.src('src/*.html')
    .pipe(useref())
    // minifies only if js file
    .pipe(gulpIf('*.js', uglify()))
    // minifies only if css file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function(cb) {
  runSequence('clean:dist',
    [ 'sass', 'useref', 'images', 'fonts'], cb);
});

gulp.task('default', function(cb) {
  runSequence(['sass', 'browserSync', 'watch'], cb);
});

gulp.task('watch', ['browserSync', 'sass'], function() {
  // scss watcher
  gulp.watch('src/scss/**/*.scss', ['sass']);
  // html watcher
  gulp.watch('src/*.html', browserSync.reload);
  // js watcher
  gulp.watch('src/js/**/*.js', browserSync.reload);
});
