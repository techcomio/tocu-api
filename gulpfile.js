var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');


gulp.task('lint', function() {
  gulp.src('./**/*.js')
    .pipe(jshint())
})

gulp.task('develop', function() {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: {'NODE_ENV': 'development'},
    ignore: ['ignored.js']
  })
    .on('change', ['lint'])
    .on('restart', function() {
      console.log('restarted!')
    })
})

gulp.task('test', function() {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: {'NODE_ENV': 'test'},
    ignore: ['ignored.js']
  })
})

gulp.task('default', ['develop']);
gulp.task('test', ['test']);
