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

// Compass & noMerge mode (0:0)
module.exports = function(grunt){
	var appRoot = '{%=static_path%}apps/{%=name%}{%=(subapp? "/"+subapp : "")%}',
		tasks = ['compass', 'cssmin', 'min'],
		cfg = {
			corePath: '{%=static_path%}sys/reset/', srcPath: appRoot+'/src',
			cssPath: appRoot+'/assets/css', jsPath: appRoot+'/assets/js'
		};

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-yui-compressor');
	grunt.loadNpmTasks('grunt-contrib-watch');

	mix(cfg, //任务配置项
	{
		compass: {
			options: {
				sassDir: '<%=srcPath%>', cssDir: '<%=cssPath%>',
				noLineComments: true
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
				files: ['<%=srcPath%>/*.source.scss'],
				tasks: ['compass', 'cssmin']
			},
			script: {
				files: ['<%=jsPath%>/**/*.source.js'],
				tasks: ['min']
			}
		}
	});

	// init & watch
	grunt.initConfig(cfg);
	grunt.event.on('watch', function(action, filepath) {
		if(grunt.file.isMatch(grunt.config('watch.style.files'), filepath)){
			grunt.config('cssmin.dist.src', cfg.cssPath + '/' + filepath.match(/[^\/]+$/g)[0].replace(/scss/, 'css'));
		}
		if(grunt.file.isMatch(grunt.config('watch.script.files'), filepath)){
			grunt.config('min.dist.src', filepath);
		}
	});
	
	// tasks
	grunt.registerTask('default', tasks.concat('watch'));
}