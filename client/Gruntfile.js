module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      release: [ 'dist' ]
    },

    copy: {
      release: {
        files: [{
          expand: true,
          cwd: 'app/',
          src: '**',
          dest: 'dist/'
        }]
      }
    },

    requirejs: {
      release: {
        options: {
          include: [
            'modules/auth/module',
            'modules/exercise/module',
            'modules/regimen/module',
            'modules/set/module',
            'modules/workout/module'
          ],
          mainConfigFile: 'app/js/config.js',
          name: 'vendor/almond/almond',
          out: 'dist/js/vendor/requirejs/require.js',
          paths: {
            bootstrap: 'empty:'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('compile', [ 'clean', 'copy', 'requirejs' ]);
};
