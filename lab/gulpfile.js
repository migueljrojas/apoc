var gulp = require('gulp');
var sass = require('gulp-sass');

var stylesDir = 'public/stylesheets/'

gulp.task('sass', function(){
  return gulp.src(stylesDir + 'scss/styles.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest(stylesDir))
});

gulp.task('watch', ['sass'], function(){
  gulp.watch(stylesDir + 'scss/styles.scss', ['sass']);
});
