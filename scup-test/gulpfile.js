
// gulp
var gulp = require('gulp');

// plugins
var webserver = require('gulp-webserver');
var sass = require('gulp-ruby-sass');
gulp.task('sass', function () {
  return sass('./assets/css/*.scss')
        .pipe(gulp.dest('assets/css'));
});


gulp.task('watch', function() {
   gulp.watch('assets/css/*.scss', ['sass']);
});


gulp.task('webserver', function() {
  gulp.src('app')
    .pipe(webserver({
      livereload: true,
      port: 8888
    }));
});

var debug = require('gulp-debug');
 
gulp.task('debug',function(){
 return gulp.src('assets/**/*.*')
        .pipe(debug({title: 'scss:'}))
        .pipe(gulp.dest('/'));
});


gulp.task('default', ['debug','sass','watch', 'webserver']);
