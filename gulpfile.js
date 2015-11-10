var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    csslint = require('gulp-csslint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    header = require('gulp-header'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    git = require('gulp-git'),
    pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

// 样式
gulp.task('styles', function() {
  return  sass('src/scss/**/*.scss', { sourcemap: true })
    .pipe(plumber())
    .pipe(sourcemaps.write())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(concat('app.css'))
    .pipe(csslint())
    .pipe(csslint.reporter())
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('public/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// 脚本
gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('app.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('public/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// 图片
gulp.task('images', function() {
  return gulp.src('src/images/*')
    .pipe(plumber())
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// 清理
gulp.task('clean', function() {
  return gulp.src(['public/scss', 'public/js', 'public/images'], {read: false})
    .pipe(clean());
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

gulp.task('watch', function() {

  gulp.watch('src/scss/*.scss', ['styles']);
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/images/*', ['images']);

  var server = livereload();
  gulp.watch(['public/**']).on('change', function(file) {
    server.changed(file.path);
  });

});
