
module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    jshint: {
      options: {
        globals: {
          "angular": true
        }
      },
      lint: {
        src: ['*.js', 'test/**/*.js']
      }
    },
    karma: {
      all: {
        configFile: "karma.conf.js",
        autowatch: false
      }
    },
    watch: {
      console: {
        files: [
            '<%= jshint.lint.src %>'
        ],
        tasks: ['default']
      }
    },
    release: {
      options: {
        npm: false,
        file: 'bower.json'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-release');

  // Default task.
  grunt.registerTask('default', ['jshint', 'karma']);
};
