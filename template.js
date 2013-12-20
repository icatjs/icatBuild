/*
 * icat-build
 * https://github.com/valleykid/icatBuild
 *
 * Copyright (c) 2013 valleykid
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = '创建一个icat项目.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = '请先执行npm install, 之后再使用grunt.';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {
  init.process({}, [
    // Prompt for these values.
    init.prompt('name'),
    init.prompt('author_name', 'author'),
    init.prompt('version', '0.0.1'),
    {
      name: 'icat_mvc',
      message: 'Do you want to use icat-mvc?',
      default: 'Y/n'
    },
    {
      name: 'css_tool',
      message: 'Which one do you use, Stylus or compass?',
      default: 'S/c'
    },
    {
      name: 'merge_file',
      message: 'Do you want to merge css/js files?',
      default: 'N/y'
    },
    {
      name: 'static_path',
      message: 'Set the static path, such as "../../repos".',
      default: ''
    }
  ], function(err, props) {
    props.devDependencies = {
      'grunt-yui-compressor': '~0.3.0',
      //'grunt-contrib-uglify': '~0.2.2',
      'grunt-contrib-watch': '~0.5.3'
    };

    var staticPath = props.static_path.replace(/\s+/, ''),
        appName = props.name.toLocaleLowerCase(),
        cssStylus = /s/i.test(props.css_tool),
        hasmvc = /y/i.test(props.icat_mvc), noMerged = /n/i.test(props.merge_file);

    props.keywords = [];
    props.repository = '';
    props.description = 'This is an applation.';

    props.icat_mvc = hasmvc;
    props.subapp = '';
    props.prefix = '';

    if(staticPath){
      props.static_path = staticPath.replace(/(\w)$/, '$1/');
      props.prefix = '~';
    }

    if(appName.indexOf('.')>-1){
      var arrName = appName.split('.');
      props.name = arrName[0];
      props.subapp = arrName[1];
    }

    props.appName = props.name.toLocaleUpperCase();
    props.cssStylus = cssStylus;
    props.noMerged = noMerged;

    // Files to copy (and process).
    var exp = /^apps\//i,
        files = init.filesToCopy(props),
        folders = noMerged? ['src', 'pic', 'assets/css', 'assets/img'] : ['pic', 'assets/css', 'assets/img'],
        path = props.static_path + 'apps/' + props.name + (props.subapp? '/'+props.subapp : '') + '/';
    
    // adjustment
    if(!noMerged){
      props.devDependencies['grunt-contrib-concat'] = '~0.3.0';
    }

    if(cssStylus){
      props.devDependencies['grunt-contrib-stylus'] = '~0.10.0';
    } else {
      props.devDependencies['grunt-contrib-compass'] = '~0.6.0';
    }

    for(var k in files){
      if(exp.test(k)){
        if(!hasmvc && /mvc\//i.test(k)){
          delete files[k];
          continue;
        }
        if(noMerged && /src[\w\/\.]+js$/i.test(k)){
          delete files[k];
          continue;
        }
        if(cssStylus && /src[\w\/\.]+scss$/i.test(k)){
          delete files[k];
          continue;
        }
        if(!cssStylus && /src[\w\/\.]+styl$/i.test(k)){
          delete files[k];
          continue;
        }
        
        files[k.replace(exp, path).replace(/name([^\/]+)$/gi, props.name+'$1')] = files[k];
        delete files[k];
      }
    }

    // Actually copy (and process) files.
    for(var i=0, len=folders.length; i<len; i++){
      /*var f = folders[i];
      /\.\w+$/.test(f)?
        grunt.file.write(path+f, '/* '+props.name+'-app\'s files /') : grunt.file.mkdir(path+f);*/
      grunt.file.mkdir(path+folders[i]);
    }
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // All done!
    done();
  });

};
