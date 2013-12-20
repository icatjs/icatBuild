'use strict';

function mix(r, s, ov){
  if(!s || !r) return r;
  if(ov===undefined) ov = true;

  for(var p in s) {
    if(ov || !(p in r)){
      r[p] = s[p];
    }
  }
  return r;
}

module.exports = function(grunt){
  // main
  var appRoot = '{%=static_path%}apps/{%=name%}{%=(subapp? "/"+subapp : "")%}', tasks,
      cfg = {
        corePath: '{%=static_path%}sys/reset/',
        srcPath: appRoot+'/src',
        cssPath: appRoot+'/assets/css',
        jsPath: appRoot+'/assets/js'
      };
{% if(noMerged){ %}
  // single mode
  tasks = [{%=(cssStylus? "'stylus'":"'compass'")%}, 'cssmin', 'min'];
  mix(cfg, {
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
        event: ['added', 'changed']
      },
      css: {
        files: ['<%=cssPath%>/*.source.css'],
        tasks: ['cssmin']
      },
      script: {
        files: ['<%=jsPath%>/**/*.source.js'],
        tasks: ['min']
      }
    }
  });
  {% if(cssStylus){ %}
  cfg.stylus = {
    dist: {
      expand: true,
      cwd: '<%=srcPath%>/',
      src: '*.source.styl',
      cssPath: '<%=cssPath%>/',
      rename: function(dest, matchedSrcPath, options){
        return options.dest = options.cssPath + matchedSrcPath.replace(/styl$/, 'css');
      }
    }
  };
  cfg.watch.stylus = {
    files: ['<%=srcPath%>/*.source.styl'],
    tasks: ['stylus']
  };
  grunt.loadNpmTasks('grunt-contrib-stylus');
  {% }else{ %}
  cfg.compass = {
    dist: {
      options: {
        sassDir: '<%=srcPath%>', cssDir: '<%=cssPath%>'
      }
    }
  };
  cfg.watch.compass = {
    files: ['<%=srcPath%>/*.scss'],
    tasks: ['compass']
  };
  grunt.loadNpmTasks('grunt-contrib-compass');
  {% } %}
{% }else{ %}
  // concat mode
  tasks = [{%=(cssStylus? "stylus":"'compass', 'concat:css'")%}, 'concat:js', 'cssmin', 'min'];
  mix(cfg, {
    cssmin: {
      dist: {
        src: '<%=cssPath%>/{%=name%}.source.css',
        dest: '<%=cssPath%>/{%=name%}.css'
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
    concat: {
      js: {
        src: ['<%=srcPath%>/*.js'],
        dest: '<%=jsPath%>/{%=name%}.source.js'
      }
    },
    watch: {
      options: {
        spawn: false,
        event: ['added', 'changed']
      },
      script: {
        files: ['<%=srcPath%>/*.js'],
        tasks: ['concat:js']
      },
      js: {
        files: ['<%=jsPath%>/**/*.source.js'],
        tasks: ['min']
      }
    }
  });
  {% if(cssStylus){ %}
  cfg.stylus = {
    dist: {
      src: ['<%=corePath%>/phonecore.styl', '<%=srcPath%>/*.styl'],
      dest: '<%=cssPath%>/{%=name%}.source.css'
    }
  };
  cfg.watch.stylus = {
    files: ['<%=srcPath%>/*.styl'],
    tasks: ['stylus', 'cssmin']
  };
  grunt.loadNpmTasks('grunt-contrib-stylus');
  {% }else{ %}
  cfg.compass = {
    dist: {
      options: {
        sassDir: '<%=srcPath%>', cssDir: '<%=srcPath%>'
      }
    }
  };
  cfg.concat.css = {
    src: ['<%=corePath%>/phonecore.source.css', '<%=srcPath%>/*.css'],
    dest: '<%=cssPath%>/{%=name%}.source.css'
  };
  cfg.watch.compass = {
    files: ['<%=srcPath%>/*.scss'],
    tasks: ['compass', 'concat:css', 'cssmin']
  };
  grunt.loadNpmTasks('grunt-contrib-compass');{%
  } %}
{% } %}
  grunt.initConfig(cfg);
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('cssmin.dist.src', filepath);
    grunt.config('min.dist.src', filepath);
  });

  // tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-yui-compressor');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', tasks.concat('watch'));
};