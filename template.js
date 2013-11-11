/*
 * icat-build
 * https://gruntjs.com/
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
    init.prompt('author_name'),
    init.prompt('version'),
    {
      name: 'hasMVC',
      message: 'Does the applation have mvc?',
      default: 'N/y'
    },
    init.prompt('timestamp'),
    init.prompt('icatVersion')
  ], function(err, props) {
    props.devDependencies = {
      'grunt-contrib-stylus': '~0.10.0',
      'grunt-contrib-concat': '~0.3.0',
      'grunt-yui-compressor': '~0.3.0',
      'grunt-contrib-watch': '~0.4.0'
    };

    props.name = props.name.toLocaleLowerCase();
    props.subapp = '';
    props.keywords = [];
    props.description = 'This is the applation.';
    props.repository = '';

    props.icatVersion = props.icatVersion? props.icatVersion : '1.1.6';
    props.timestamp = props.timestamp? props.timestamp : '20131110';
    props.hasMVC = /n/i.test(props.hasMVC);

    if(props.name.indexOf('.')>-1){
      var arrName = props.name.split('.');
      props.name = arrName[0];
      props.subapp = arrName[1];
    }

    // Files to copy (and process).
    var exp = /^apps\//i, files = init.filesToCopy(props),
        path = 'apps/' + props.name + (props.subapp? '/'+props.subapp : '');
    
    // adjustment
    for(var k in files){
      if(exp.test(k)){
        if(props.hasMVC && /\/mvc/i.test(k)){
          delete files[k];
        } else {
          files[k.replace(/name/gi, props.name).replace(exp, path+'/')] = files[k];
          delete files[k];
        }
      }
    }

    // Actually copy (and process) files.
    //grunt.file.mkdir(path);
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // All done!
    done();
  });

};
