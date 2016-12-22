const gulp = require('gulp');
const typescript = require('gulp-typescript');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const copy = require('gulp-copy');

gulp.task('default', [
    'render pug',
    'compile ts',
    'compile stylesheets',
    'copy php',
    'copy materialize'
]);

gulp.task('render pug', () => {
    gulp.src('./src/pug/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('./build'));
});

gulp.task('compile typescript', () => {
    gulp.src('./src/typescript/work.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript({
            noImplicitAny: true,
            target: 'es5'
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build'));
});

gulp.task('compile stylesheets', () => {
    gulp.src('./src/sass/main.scss')
        .pipe(sass())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./build'));
});

gulp.task('copy php', _ => {
  	return gulp.src(['src/php/*.php'])
  	           .pipe(copy('./build', {prefix: 2}))
  	           .pipe(gulp.dest('./build'));
});

gulp.task('copy materialize', _ => {
  	return gulp.src(['src/materialize.min.js'])
  	           .pipe(copy('./build'))
  	           .pipe(gulp.dest('./build'));
});

gulp.task('compile ts', () => {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/typescript/work.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('work.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./build'));
});
