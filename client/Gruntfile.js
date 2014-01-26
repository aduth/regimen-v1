module.exports = function(grunt) {
  grunt.initConfig({

    less: {
      compile: {
        files: {
          'app/assets/css/main.css': [ 'app/assets/less/main.less' ]
        }
      }
    },

    requirejs: {
      compile: {
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
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('compile', [ 'less', 'requirejs' ]);
};
