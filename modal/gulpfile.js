var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

var stylesDir = 'public/stylesheets/'

gulp.task('sass', function(){
  return gulp.src(stylesDir + 'scss/style.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest(stylesDir))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['sass'], function(){
  gulp.watch(stylesDir + 'scss/style.scss', ['sass']);
})
