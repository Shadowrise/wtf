import gulp from 'gulp'
import sass from 'gulp-sass'
import sassCompiler from 'node-sass'
import babel from 'gulp-babel'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify-es'
import rename from 'gulp-rename'
import cleanCSS from 'gulp-clean-css'
import del from 'del'
import browserSync from 'browser-sync'
import autoprefixer from 'gulp-autoprefixer'
import plumber from 'gulp-plumber'
import sourcemaps from 'gulp-sourcemaps'

sass.compiler = sassCompiler

const paths = {
  html: {
    src: 'src/index.html',
    dist: 'dist/'
  },
  styles: {
    src: 'src/scss/**/*.scss',
    dist: 'dist/css'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dist: 'dist/scripts'
  }
}

export function clean() {
  return del(['dist/css', 'dist/scripts'])
}

export function styles() {
  return (
    gulp
      .src(paths.styles.src)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(
        autoprefixer({
          cascade: false
        })
      )
      .pipe(cleanCSS())
      // pass in options to the stream
      .pipe(
        rename({
          basename: 'style',
          suffix: '.min'
        })
      )
      .pipe(sourcemaps.write('.'))
      .pipe(plumber.stop())
      .pipe(gulp.dest(paths.styles.dist))
  )
}

export function html() {
  return gulp.src(paths.html.src).pipe(gulp.dest(paths.html.dist))
}

export function scripts() {
  return gulp
    .src(paths.scripts.src, { sourcemaps: true })
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dist))
}

export function sync(done) {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    }
  })
  done()
}

export function watch() {
  gulp.watch(paths.scripts.src, scripts).on('change', browserSync.reload)
  gulp.watch(paths.styles.src, styles).on('change', browserSync.reload)
  gulp.watch(paths.html.src, html).on('change', browserSync.reload)
}

export const build = gulp.series(clean, scripts, styles, html)
export const serve = gulp.series(build, sync, watch)
export default serve
