'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var through2 = require('through2');

gulp.task('sass', function () {
  gulp.src('./app/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('assets', function () {
  gulp.src('./app/assets/**/*', {base:"./app/assets"})
        .pipe(gulp.dest('dist'));
  gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('data', function () {
  gulp.src('./data/*')
    .pipe(gulp.dest('./dist/data'));
});

gulp.task('bundle', function () {
    return gulp.src('./app/app.js')
        .pipe(through2.obj(function (file, enc, next) {
            browserify(file.path)
                .bundle(function (err, res) {
                    if (err) { return next(err); }
                    file.contents = res;
                    next(null, file);
                });
        }))
        .on('error', function (error) {
            console.log(error.stack);
            this.emit('end');
        })
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['assets', 'data', 'sass', 'bundle']);