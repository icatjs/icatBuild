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

// Stylus & Merge mode (1:1)
module.exports = function(grunt){
	var appRoot = '{%=static_path%}apps/{%=name%}{%=(subapp? "/"+subapp : "")%}',
		tasks = ['stylus', 'cssmin', 'concat', 'min'],
		cfg = {
			corePath: '{%=static_path%}sys/reset/', srcPath: appRoot+'/src',
			cssPath: appRoot+'/assets/css', jsPath: appRoot+'/assets/js'
		};

	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-yui-compressor');
	grunt.loadNpmTasks('grunt-contrib-watch');

	mix(cfg, //任务配置项
	{
		stylus: {
			dist: {
				src: ['<%=corePath%>/phonecore.styl', '<%=srcPath%>/*.styl'],
				dest: '<%=cssPath%>/{%=name%}.source.css'
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

		concat: {
			dist: {
				src: ['<%=srcPath%>/*.js'],
				dest: '<%=jsPath%>/{%=name%}.source.js'
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
				files: ['<%=srcPath%>/*.styl'],
				tasks: ['stylus', 'cssmin']
			},
			script: {
				files: ['<%=srcPath%>/*.js'],
				tasks: ['concat', 'min']
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
