module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		appConfig: {
			timestamp: Date.now()
		},

		clean: {
			html: ["dist/*.html"],
			styles: ["dist/assets/**/*.css"],
			images: ["src/img/svgmin/", "dist/assets/img/pngfallbacks/"]
		},

		convert: {
			options: {
				explicitArray: false
			},
			csv2json: {
				src: ['src/data/data.csv'],
				dest: 'dist/assets/data/data.json'
			}
		},

		'compile-handlebars': {
			allStatic: {
				files: [{
					src: 'src/handlebars/index.hbs',
					dest: 'dist/index.html'
				}],
				templateData: 'src/data/data.json',
				helpers: [
					'src/handlebars/helpers/test.js'
				]
			}
		},

		svgmin: {
			options: {
				plugins: [
					{removeViewBox: false},
					{removeUselessStrokeAndFill: false},
					{
						convertPathData: {
							straightCurves: false
						}
					}
				]
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'src/img/svg', //src matches are relative to this path.
						src: ['*.svg'],
						dest: 'src/img/svgmin',
						ext: '.svg'
					}
				]
			}
		},

		grunticon: {
			iconGenerator: {
				files: [{
					expand: true,
					cwd: 'src/img/svgmin',
					src: ['*.svg'],
					dest: 'src/img/svgcss'
				}],
				options: {
					datasvgcss: '_svg.data.scss',
					urlpngcss: '_svg.pngfallbacks.scss',
					pngfolder: '../../../dist/assets/img/pngfallbacks',
					cssprefix: '.svg-',
					previewhtml: 'svg-preview.html',
					previewTemplate: 'src/img/svgcss/svg-preview.hbs'
				}
			}
		},

		replace: {
			fallbackSelector: {
				src: ['src/img/svgcss/_svg.pngfallbacks.scss'],
				dest: 'src/img/svgcss/_svg.pngfallbacks.scss',
				replacements: [{
					from: ".svg-",
					to: "html.has-no-svg .svg-"
				}]
			},
			imageUrlPaths: {
				src: ['src/img/svgcss/_svg.pngfallbacks.scss'],
				dest: 'src/img/svgcss/_svg.pngfallbacks.scss',
				replacements: [{
					from: "url('../../../dist/assets/img/pngfallbacks",
					to: "url('assets/img/pngfallbacks"
				}]
			}
		},

		sass: {
			options: {
				outputStyle: 'compressed',
				sourceMap: false
			},
			dist: {
				files: {
					'dist/assets/css/screen.css': 'src/scss/screen.scss',
					'dist/assets/css/images.css': 'src/scss/images.scss'
				}
			}
		},

		uglify: {
			options: {
				mangle: true
			},
			my_target: {
				files: {
					'dist/assets/js/jquery.c4saValentines.min.js': [
						"dist/assets/js/polyfills/console.js",
						"dist/assets/js/lib/jquery.min.js",
						"dist/assets/js/polyfills/jquery.rangeslider.min.js",
						"dist/assets/js/modules/jquery.c4saHelpers.js",
						"dist/assets/js/modules/jquery.c4saForms.js",
						"dist/assets/js/bespoke/jquery.c4saHandleAges.js",
						"dist/assets/js/bespoke/jquery.c4saAgeSlider.js",
						"dist/assets/js/bespoke/jquery.c4saGenderStyling.js",
						"dist/assets/js/jquery.c4saValentines.js"
					]
				}
			}
		},

		watch: {
			html: {
				files: ['src/handlebars/**/*'],
				tasks: ['clean:html', 'compile-handlebars'],
				options: {
					spawn: false
				}
			},
			sass: {
				files: ['src/scss/**/*.scss'],
				tasks: ['sass'],
				options: {
					spawn: false
				}
			},
			js: {
				files: ['dist/**/*.js'],
				tasks: ['uglify'],
				options: {
					spawn: false
				}
			}
		}


	});

	grunt.loadNpmTasks('grunt-convert');
	grunt.loadNpmTasks('grunt-compile-handlebars');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-grunticon');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['clean', 'convert', 'compile-handlebars', 'svgmin', 'grunticon', 'replace', 'sass', 'uglify']);

};