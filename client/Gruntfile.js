module.exports = function(grunt) {
  grunt.initConfig({

    less: {
      compile: {
        files: {
          'app/assets/css/main.css': [ 'app/assets/less/main.less' ]
        }
      }
    },

    watch: {
      less: {
        files: [ 'app/assets/less/**/*.less' ],
        tasks: [ 'less' ]
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [ 'app/assets/css/main.css' ]
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
            'modules/dashboard/module',
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

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('compile', [ 'less', 'requirejs' ]);
  grunt.registerTask('dev', [ 'less', 'watch' ]);
  grunt.registerTask('default', [ 'dev' ]);
};
