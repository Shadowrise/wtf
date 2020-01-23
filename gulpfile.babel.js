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
import htmlmin from 'gulp-htmlmin'

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
    src: [
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      `${dirs.src}/scss/**/*.scss`
    ],
    dist: `${dirs.dist}/css`
  },
  scripts: {
    src: [`${dirs.src}/js/main.js`],
    dist: `${dirs.dist}/scripts`
  },
  imgs: {
    src: [`${dirs.src}/img/*.png`],
    dist: `${dirs.dist}/img`
  },
  libs: {
    src: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
    ],
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
    .pipe(concat('style.min.css'))
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
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dist))
    .pipe(plumber.stop())
    .pipe(browserSync.stream())

// Html
export const html = () =>
  src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(paths.html.dist))
    .pipe(browserSync.stream())

// Images
export const imgs = () =>
  src(paths.imgs.src)
    .pipe(dest(paths.imgs.dist))
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

export const libs = () =>
  src(paths.libs.src)
    .pipe(plumber())
    .pipe(concat('libs.min.js'))
    .pipe(dest(paths.libs.dist))
    .pipe(plumber.stop())

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

export const build = series(clean, parallel(scripts, libs, styles, html, imgs))
export const serve = series(build, sync)

export default serve
