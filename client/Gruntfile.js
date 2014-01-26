module.exports = function(grunt) {
  grunt.initConfig({

    requirejs: {
      release: {
        options: {
          include: [
            'modules/auth/module',
            'modules/exercise/module',
            'modules/regimen/module',
            'modules/set/module',
            'modules/workout/module',
            'config/sync'
          ],
          mainConfigFile: 'app/js/config.js',
          name: 'vendor/almond/almond',
          out: 'app/js/bundle.min.js',
          paths: {
            bootstrap: 'empty:',
            constants: 'empty:'
          }
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('compile', [ 'requirejs' ]);
};
