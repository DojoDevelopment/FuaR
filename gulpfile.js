var gulp = require('gulp')
	, less = require('gulp-less')
	, livereload = require('gulp-livereload')
	, nodemon = require('gulp-nodemon');

gulp.task('less', function() {
  gulp.src('client/css/*.less')
    .pipe(less())
    .pipe(gulp.dest('client/css/'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('client/css/*.less', ['less']);
});

gulp.task('develop', function(){
	  nodemon({ script: 'server.js', ext: 'html js' })
    .on('restart', function () {
      console.log('restarted!')
    })
});

gulp.task('default', ['less', 'watch', 'develop']);