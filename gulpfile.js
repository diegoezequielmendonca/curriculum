const 	{ gulp, dest, src, parallel, series, watch } = require('gulp'),
		browserSync = require('browser-sync'),
		del = require('del'),
		merge = require('merge-stream'),
		min = require('gulp-minify'),
		pug = require('gulp-pug'),
		sass = require('gulp-sass'),
		spritesmith = require('gulp.spritesmith')

const paths = {
	css:		'/assets/css',
	fonts:		'/assets/fonts',
	img:		'/assets/img',
	js:			'/assets/js',
	scss:		'/assets/scss',
	sprite:		'/assets/img/sprite',
	vendors:	'/assets/vendors'
}

let folders = {
	dev:	'./dev',
	dist:	'./dist',
	src:	'./src'
}

/* Working folder setting tasks */

setDev = (done) => {
	wf = folders.dev
	done()
}

setDist = (done) => {
	wf = folders.dist
	done()
}

/* Tasks */

clear = () => {
	return del([wf + '/**/*', folders.src + paths.scss + '/_sprite.scss'])
}

css = () => {
	return src(folders.src + paths.scss + '/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(dest(wf + paths.css))
}

fonts = () => {
	return src(folders.src + paths.fonts + '/*')
		.pipe(dest(wf + paths.fonts))
}

img = () => {
	return src([folders.src + paths.img + '/*', '!' + folders.src + paths.img + '/sprite'])
		.pipe(dest(wf + paths.img))
}

js = () => {
	return src(folders.src + paths.js + '/*.js')
		.pipe(min({ext: {min: '.min.js'}, noSource: true}))
		.pipe(dest(wf + paths.js))
}

reload = (done) => {
	browserSync.reload()
	done()
}

serve = () => {
	browserSync.init({
		notify: false,
		server: wf
	})

	watch(wf + '/**/*', reload)
}

sprite = () => {
	let spriteStream = src(folders.src + paths.sprite + '/*.png')
			.pipe(spritesmith({cssName: '_sprite.scss', imgName: 'sprite.png', imgPath: '../img/sprite/sprite.png'})),
		imgStream = spriteStream.img
			.pipe(dest(wf + paths.sprite)),
		cssStream = spriteStream.css
			.pipe(dest(folders.src + paths.scss))
	
	return merge(cssStream, imgStream)
}

vendors = () => {
	return src(folders.src + paths.vendors + '/*')
		.pipe(dest(wf))
}

views = () => {
	return src(folders.src + '/views/pages/*.pug')
		.pipe(pug({pretty: '\t'}))
		.pipe(dest(wf))
}

watcher = () => {
	watch(folders.src + paths.js + '/*.js', js)
	watch(folders.src + paths.scss + '/**/*.scss', css)
	watch(folders.src + paths.fonts + '/**/*', fonts)
	watch([folders.src + paths.img + '/*', '!' + folders.src + paths.img + '/sprite'], img)
	watch(folders.src + '/**/*.pug', views)
}

/* Exports */

exports.dev = parallel(series(setDev, clear, sprite, img, css, fonts, js, vendors, views, serve), watcher)

exports.dist = series(setDist, clear, sprite, img, css, fonts, js, vendors, views)