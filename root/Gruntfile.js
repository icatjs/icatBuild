'use strict';

module.exports = function(grunt){
  grunt.initConfig({
    cssPath: 'apps/{%=name%}{%=(subapp? "/"+subapp: "")%}/assets/css',
    jsPath: 'apps/{%=name%}{%=(subapp? "/"+subapp: "")%}/assets/js',

    stylus: {
      dist: {
        name: 'main',
        src: ['<%=cssPath%>/*.styl'],
        dest: '<%=cssPath%>/<%=stylus.dist.name%>.source.css'
      }
    },

    cssmin: {
      dist: {
        files: {
          '<%=cssPath%>/<%=stylus.dist.name%>.css': ['<%=stylus.dist.dest%>']
        }
      }
    },

    min: {
      dist: {
        files: {
          '<%=jsPath%>/main.js': ['<%=jsPath%>/main.source.js'],
          '<%=jsPath%>/{%=name%}.js': ['<%=jsPath%>/**/*.source.js', '!<%=jsPath%>/main.source.js']
        }
      }
    },

    watch: {
      files: ['<%=cssPath%>/*.styl', '<%=jsPath%>/**/*.source.js'],
      tasks: ['stylus', 'cssmin', 'min']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-yui-compressor');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['stylus', 'cssmin', 'min', 'watch']);
};