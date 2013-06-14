
module.exports = (grunt) ->

  # Project configuration
  grunt.initConfig
    pkg: 
      grunt.file.readJSON('package.json')

    nodemon:
      default:
        options:
          ignoredFiles: ['README.md', 'node_modules/**', 'db/**']
          watchedExtensions: ['.js']
          debug: false
          delayTime: 1
      debug:
        options:
          ignoredFiles: ['README.md', 'node_modules/**', 'db/**']
          watchedExtensions: ['.js']
          debug: true
          delayTime: 1

  grunt.loadNpmTasks('grunt-nodemon');
  
  grunt.registerTask('default', ['nodemon:default' ])
  grunt.registerTask('dbg', ['nodemon:debug'])
