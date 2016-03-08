(function () {
    'use strict';

    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        sass = require('gulp-sass'),
        useref = require('gulp-useref'),
        uglify = require('gulp-uglify'),
        gulpIf = require('gulp-if'),
        cssnano = require('gulp-cssnano'),
        imagemin = require('gulp-imagemin'),
        cache = require('gulp-cache'),
        del = require('del'),
        runSequence = require('run-sequence'),
        jshint = require('gulp-jshint');

    gulp.task('default', function () {
        return gutil.log('Gulp is running!');
    });

    gulp.task('sass', function () {
        return gulp.src(['source/scss/*.scss', '!source/scss/_*.scss'])
            .pipe(sass())
            .pipe(gulp.dest('source/css'));
    });

    gulp.task('jshint', function () {
        return gulp.src('source/js/**/*.js')
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'));
    });

    // concat and minify *.js and *.css
    gulp.task('useref', function () {
        return gulp.src('source/*.html')
            .pipe(useref())
            .pipe(gulpIf('*.js', uglify()))
            .pipe(gulpIf('*.css', cssnano()))
            .pipe(gulp.dest('public'));
    });

    gulp.task('images', function () {
        return gulp.src('source/img/**/*.+(png|jpg|gif|svg)')
            //.pipe(cache(imagemin()))
            .pipe(imagemin())
            .pipe(gulp.dest('public/img'));
    });

    gulp.task('fonts', function () {
        return gulp.src('source/fonts/**/*')
            .pipe(gulp.dest('public/fonts'));
    });

    gulp.task('clean:public', function () {
        return del.sync('public');
    });

    gulp.task('cache:clear', function (callback) {
        return cache.clearAll(callback);
    });

    gulp.task('palantir', function () {
        gulp.watch('source/scss/**/*.scss', ['sass']);
        gulp.watch('source/js/**/*.js', ['jshint']);
    });

    gulp.task('forge', function () {
        return runSequence('clean:public', ['sass', 'useref', 'images', 'fonts']);
    });
}());