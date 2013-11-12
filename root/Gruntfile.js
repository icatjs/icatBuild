'use strict';

module.exports = function(grunt){
  // compress
  grunt.registerMultiTask('concatMin', 'YUI-Compressor', function(){
    if(this.target.toLocaleLowerCase()==='css'){
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
          if(f.indexOf('*')<0)
            ofs[f.split('.source').join('')] = f;
        });
    });
    if(this.target.toLocaleLowerCase()==='css'){
      grunt.config('cssmin', ofs);
      grunt.task.run('cssmin');
    }
    else {
      grunt.config('min', ofs);
      grunt.task.run('min');
    }
  });

  // main
  grunt.initConfig({
    cssPath: '{%=staticPath%}apps/{%=name%}{%=(subapp? "/"+subapp: "")%}/assets/css',
    jsPath: '{%=staticPath%}apps/{%=name%}{%=(subapp? "/"+subapp: "")%}/assets/js',

    stylus: {
      dist: {
        name: 'main',
        src: ['{%=staticPath%}sys/reset/phonecore.source.styl', '<%=cssPath%>/*.styl'],
        dest: '<%=cssPath%>/<%=stylus.dist.name%>.source.css'
      }
    },
    
    concatMin: {
      css: {
        files: {
          '<%=cssPath%>/<%=stylus.dist.name%>.css': ['<%=stylus.dist.dest%>']
        }
      }
    },

    singleMin: {
      js: {
        src: ['<%=jsPath%>/**/*.source.js']
      }
    },

    watch: {
      files: ['<%=cssPath%>/*.styl', '<%=jsPath%>/**/*.source.js'],
      tasks: ['stylus', 'concatMin:css', 'singleMin:js']
    }
  });

  // tasks
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-yui-compressor');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['stylus', 'concatMin:css', 'singleMin:js', 'watch']);
};