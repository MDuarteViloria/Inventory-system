const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');

// Rutas de los archivos
const paths = {
  scripts: {
    src: 'src/**/*.js',
    dest: 'dist/'
  },
  assets: {
    src: ['src/**/*', '!src/**/*.js', '!src/**/public/images/**', '!src/**/*.db'], // Todos los archivos excepto .js
    dest: 'dist/'
  }
};

// Tarea para minificar JavaScript
function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Tarea para copiar otros archivos manteniendo la estructura
function copyAssets() {
  return gulp.src(paths.assets.src)
    .pipe(gulp.dest(paths.assets.dest));
}

// Tarea para observar cambios y ejecutar automáticamente las tareas de minificación y copia
function watchFiles() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.assets.src, copyAssets);
}

// Definición de las tareas
const build = gulp.series(gulp.parallel(scripts, copyAssets), watchFiles);

// Exportar las tareas
exports.scripts = scripts;
exports.copyAssets = copyAssets;
exports.watch = watchFiles;
exports.build = build;
exports.default = build;
