'use strict';

function mix(r, s, ov){
	if(!s || !r) return r;
	if(ov===undefined) ov = true;

	for(var p in s){
		if(ov || !(p in r)){
			r[p] = s[p];
		}
	}
	return r;
}

// Compass & Merge mode (0:1)
module.exports = function(grunt){
	var appRoot = '{%=static_path%}apps/{%=name%}{%=(subapp? "/"+subapp : "")%}',
		tasks = ['compass', 'concat:css', 'cssmin', 'concat:js', 'min'],
		cfg = {
			corePath: '{%=static_path%}sys/reset/', srcPath: appRoot+'/src',
			cssPath: appRoot+'/assets/css', jsPath: appRoot+'/assets/js'
		};

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-yui-compressor');
	grunt.loadNpmTasks('grunt-contrib-watch');

	mix(cfg, //任务配置项
	{
		compass: {
			options: {
				sassDir: '<%=srcPath%>', cssDir: '<%=srcPath%>',
				noLineComments: true
			}
		},

		concat: {
			css: {
				src: ['<%=corePath%>/phonecore.source.css', '<%=srcPath%>/*.css'],
				dest: '<%=cssPath%>/{%=name%}.source.css'
			},
			js: {
				src: ['<%=srcPath%>/*.js'],
				dest: '<%=jsPath%>/{%=name%}.source.js'
			}
		},

		cssmin: {
			dist: {
				expand: true,
				src: '<%=cssPath%>/*.source.css',
				rename: function(dest, matchedSrcPath, options){
					return options.dest = matchedSrcPath.replace(/\.source/g, '');
				}
			}
		},

		min: {
			dist: {
				expand: true,
				src: '<%=jsPath%>/**/*.source.js',
				rename: function(dest, matchedSrcPath, options){
					return options.dest = matchedSrcPath.replace(/\.source/g, '');
				}
			}
		},

		watch: {
			options: {
				spawn: false,
				event: ['added', 'changed', 'created']
			},
			style: {
				files: ['<%=srcPath%>/*.scss'],
				tasks: ['compass', 'concat:css', 'cssmin']
			},
			script: {
				files: ['<%=srcPath%>/*.js'],
				tasks: ['concat:js', 'min']
			},
			css: {
				files: ['<%=cssPath%>/*.source.css', '!<%=cssPath%>/{%=name%}.source.css'],
				tasks: ['cssmin']
			},
			js: {
				files: ['<%=jsPath%>/**/*.source.js', '!<%=jsPath%>/{%=name%}.source.js'],
				tasks: ['min']
			}
		}
	});

	// init & watch
	grunt.initConfig(cfg);
	grunt.event.on('watch', function(action, filepath) {
		if(grunt.file.isMatch(grunt.config('watch.css.files'), filepath)){
			grunt.config('cssmin.dist.src', cfg.cssPath + '/{%=name%}.source.css');
		}
		if(grunt.file.isMatch(grunt.config('watch.css.files'), filepath)){
			grunt.config('cssmin.dist.src', filepath);
		}

		if(grunt.file.isMatch(grunt.config('watch.script.files'), filepath)){
			grunt.config('min.dist.src', cfg.jsPath + '/{%=name%}.source.js');
		}
		if(grunt.file.isMatch(grunt.config('watch.js.files'), filepath)){
			grunt.config('min.dist.src', filepath);
		}
	});

	// tasks
	grunt.registerTask('default', tasks.concat('watch'));
}