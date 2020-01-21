import { src, dest, watch, parallel, series } from 'gulp'
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

const dirs = {
  src: 'src',
  dist: 'dist'
}

const paths = {
  html: {
    src: `${dirs.src}/index.html`,
    dist: `${dirs.dist}/`
  },
  styles: {
    src: `${dirs.src}/scss/**/*.scss`,
    dist: `${dirs.dist}/css`
  },
  scripts: {
    src: `${dirs.src}/js/**/*.js`,
    dist: `${dirs.dist}/scripts`
  }
}

// Clean
export const clean = () => del([dirs.dist])

// Styles
export const styles = () =>
  src(paths.styles.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(
      cleanCSS({
        level: 2
      })
    )
    // pass in options to the stream
    .pipe(
      rename({
        basename: 'style',
        suffix: '.min'
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dist))
    .pipe(plumber.stop())
    .pipe(browserSync.stream())

// Html
export const html = () =>
  src(paths.html.src)
    .pipe(dest(paths.html.dist))
    .pipe(browserSync.stream())

// Scripts
export const scripts = () =>
  src(paths.scripts.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    // .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify({ toplevel: 2 }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scripts.dist))
    .pipe(plumber.stop())
    .pipe(browserSync.stream())

export const sync = () => {
  browserSync.init({
    server: {
      baseDir: `${dirs.dist}/`
    }
  })

  watch(paths.scripts.src, scripts)
  watch(paths.styles.src, styles)
  watch(paths.html.src, html)
}

export const build = series(clean, parallel(scripts, styles, html))
export const serve = series(build, sync)

export default serve
