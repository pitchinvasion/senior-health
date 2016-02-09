var gulp = require('gulp');
var karmaServer = require('karma').Server;
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var path = require('path');
var child_process = require('child_process');
var http = require('http');
var ecstatic = require('ecstatic');
var enableDestroy = require('server-destroy');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('test', function(done) {
  new karmaServer({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done).start();
});

var protractor = require("gulp-protractor").protractor;

(function e2eTests() {
  var server;
  gulp.task('server', function(){
    var port = 8080;
    server = http.createServer(
      ecstatic({ root: 'public/.' })
    ).listen(port);
    enableDestroy(server);
    console.log('Server live on ' + port);
  });

  gulp.task('e2e', ['server'], function(cb) {
    gulp.src(["./test/e2e/*.js"])
        .pipe(protractor({
            configFile: "test/e2e/conf.js",
            args: ['--baseUrl', 'http://127.0.0.1:8000']
        }))
        .on('error', function(e) { throw e; })
        .on('close', function() { server.destroy(); });
  });
})();
