'use strict';

module.exports = function(grunt){
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
          if(f.indexOf('*')<0)
            ofs[f.split('.source').join('')] = f;
        });
    });
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
        src: [coreCSS, '<%=cssPath%>/*.source.css'],
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
      script: {
        files: ['<%=jsPath%>/**/*.source.js'],
        tasks: ['singleMin:js']
      },

      scss: {
        files: ['<%=srcPath%>/*.scss'],
        tasks: ['compass', 'concat', 'concatMin:css']
      },

      stylus: {
        files: ['<%=srcPath%>/*.styl'],
        tasks: ['stylus', 'concat', 'concatMin:css']
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