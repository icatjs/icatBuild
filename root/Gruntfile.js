'use strict';

module.exports = function(grunt){
  var changeFiles;
  grunt.event.on('watch', function(action, filepath){
    changeFiles = [];
    changeFiles.push(
      filepath.replace(/[^\/]+\/|\//g, '')
    );
  });

  // compress
  grunt.registerMultiTask('concatMin', 'YUI-Compressor', function(){
    if(/css/i.test(this.target)){
      grunt.config('cssmin', this.files);
      grunt.task.run('cssmin');
    }
    else {
      grunt.config('min', this.files);
      grunt.task.run('min');
    }
  });

  // singleCompress
  grunt.registerMultiTask('singleMin', 'YUI Compressor for the single file', function(){
    var ofs = {};
    this.files.forEach(function(file) {
      file.src.forEach(function(f){
        if(f.indexOf('*')<0){
          if(changeFiles){
            var _f = f.replace(/[^\/]+\/|\//g, '');
            if(changeFiles.indexOf(_f)!==-1)
              ofs[f.split('.source').join('')] = f;
          } else
            ofs[f.split('.source').join('')] = f;
        }
      });
    });
    grunt.log.writeln('Some single files begin compressing...');
    if(/css/i.test(this.target)){
      grunt.config('cssmin', ofs);
      grunt.task.run('cssmin');
    }
    else {
      grunt.config('min', ofs);
      grunt.task.run('min');
    }
  });

  // main
  var appRoot = '{%=staticPath%}apps/{%=name%}{%=(subapp? "/"+subapp: "")%}',
      coreCSS = '{%=staticPath%}sys/reset/phonecore.source.css',
      tasks = ['compass', 'stylus', 'concat', 'concatMin:css', 'singleMin:js'];
  grunt.initConfig({
    srcPath: appRoot+'/src',
    cssPath: appRoot+'/assets/css',
    jsPath: appRoot+'/assets/js',

    compass: {
      dist: {
        options: {
          sassDir: '<%=srcPath%>',
          cssDir: '<%=cssPath%>'
        }
      }
    },

    stylus: {
      dist: {
        src: ['<%=srcPath%>/*.styl'],
        dest: '<%=cssPath%>/stylFiles.source.css'
      }
    },

    concat: {
      dist: {
        src: [coreCSS, '<%=cssPath%>/*.source.css', '!<%=cssPath%>/main.source.css'],
        dest: '<%=cssPath%>/main.source.css'
      }
    },
    
    concatMin: {
      css: {
        files: {
          '<%=cssPath%>/main.css': ['<%=concat.dist.dest%>']
        }
      }
    },

    singleMin: {
      js: {
        src: ['<%=jsPath%>/**/*.source.js']
      }
    },

    watch: {
      options: {
        spawn: false
      },
      scss: {
        files: ['<%=srcPath%>/*.scss'],
        tasks: ['compass', 'concat']
      },
      stylus: {
        files: ['<%=srcPath%>/*.styl'],
        tasks: ['stylus', 'concat']
      },
      css: {
        files: ['<%=cssPath%>/*.source.css'],
        tasks: ['singleMin:css']
      },
      script: {
        files: ['<%=jsPath%>/**/*.source.js'],
        tasks: ['singleMin:js']
      }
    }
  });

  // tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-yui-compressor');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', tasks.concat('watch'));
};