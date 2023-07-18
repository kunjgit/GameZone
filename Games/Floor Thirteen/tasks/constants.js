module.exports = function(grunt) {

  var util = require('util');

  grunt.registerMultiTask('constants', 'Expose JSON constants to the browser.', function() {
    var options = this.options({
      namespace: '',
    });

    this.files.forEach(function(file) {
      var constants = {};
      var contents = '';

      file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        var rawConstants = grunt.file.readJSON(filepath);
        for (var p in rawConstants) {
          if (rawConstants.hasOwnProperty(p)) {
            constants[p] = rawConstants[p];
          }
        }
      });

      for (var p in constants) {
        contents += util.format("var %s%s = %s;\n", options.namespace, p, util.inspect(constants[p]));
      }

      grunt.file.write(file.dest, contents);
      grunt.log.writeln('File "' + file.dest + '" created.');
    });
  });

};
