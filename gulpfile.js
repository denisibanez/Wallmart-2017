var gulp = require('gulp'),
clean = require('gulp-clean'),
imagemin = require('gulp-imagemin'),
sass = require('gulp-sass'),
usemin = require('gulp-usemin'),
uglify = require('gulp-uglify'),
minifyHtml = require('gulp-minify-html'),
minifyCss = require('gulp-minify-css'),
rev = require('gulp-rev'),
jshint = require('gulp-jshint'),
jshintStylish = require('jshint-stylish'),
autoprefixer = require('gulp-autoprefixer'),
svgSprite = require("gulp-svg-sprites"),
browserSync = require ('browser-sync').create();

//default
gulp.task('default', ['copy'], function() {
  gulp.start('build-img' , 'usemin', 'server');
});

//build copy
gulp.task('copy', ['clean'], function() {
	return gulp.src('src/**/*')
		.pipe(gulp.dest('dist'));
});

//build clean
gulp.task('clean', function() {
	return gulp.src('dist')
		.pipe(clean());
});

//otimizar img
gulp.task('build-img', function() {
  return gulp.src('dist/assets/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/images'));
});

//svgsprites
gulp.task('sprites', function () {
    return gulp.src('src/assets/svg/*.svg')
        .pipe(svgSprite())
        .pipe(gulp.dest("src/assets/images/icons"));
});

//minificar
gulp.task('usemin', function() {
  return gulp.src('dist/**/*.html')
    .pipe(usemin({
      css: [ autoprefixer, minifyCss, 'concat', rev ],
      html: [ function () {return minifyHtml({ empty: true });} ],
      js: [ uglify, rev ],
      inlinejs: [ uglify ],
      inlinecss: [ autoprefixer, minifyCss, 'concat' ]
    }))
    .pipe(gulp.dest('dist'));
});

//server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });

    gulp.watch("src/assets/sass/**/*.scss", ['sass']);
    gulp.watch('src/**/*').on('change', browserSync.reload);

    // Compile sass into CSS & auto-inject into browsers
    gulp.task('sass', function() {
      return gulp.src("src/assets/sass/**/*.scss")
          .pipe(sass())
          .pipe(gulp.dest("src/assets/css"))
          .pipe(browserSync.stream());
    });

    gulp.watch('src/js/**/*.js').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(jshint())
            .pipe(jshint.reporter(jshintStylish));
    });

    gulp.watch('src/css/**/*.css').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(csslint())
            .pipe(csslint.reporter());
    });
});
