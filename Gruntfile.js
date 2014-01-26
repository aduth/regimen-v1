module.exports = function(grunt) {
  var homePath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

  grunt.initConfig({
    //---------------------------
    // Configuration
    //---------------------------

    remote: {
      host: 'regimenapp.com',
      username: 'deploy',
      sitePath: '/home/deploy/regimenapp.com',
      privateKey: grunt.file.read(homePath + '/.ssh/id_rsa')
    },

    //---------------------------
    // Tasks
    //---------------------------

    compress: {
      deploy: {
        options: {
          archive: 'deploy.tar.gz'
        },
        mode: 'tgz',
        files: [{
          expand: true,
          cwd: process.cwd(),
          src: [
            '*.*',
            'api/**',
            '!api/node_modules/**',
            'client/**',
            '!client/node_modules/**',
            '!client/app/js/**',
            'client/app/js/bundle.min.js'
          ]
        }]
      }
    },

    sftp: {
      deploy: {
        files: {
          './': 'deploy.tar.gz'
        },
        options: {
          path: '<%= remote.sitePath %>/',
          host: '<%= remote.host %>',
          username: '<%= remote.username %>',
          privateKey: '<%= remote.privateKey %>'
        }
      }
    },

    sshexec: {
      options: {
        host: '<%= remote.host %>',
        username: '<%= remote.username %>',
        privateKey: '<%= remote.privateKey %>'
      },

      clean: {
        command: 'rm -rf <%= remote.sitePath %>/www/*'
      },

      decompress: {
        command: 'tar -xzf <%= remote.sitePath %>/deploy.tar.gz -C <%= remote.sitePath %>/www'
      },

      removePackage: {
        command: 'rm <%= remote.sitePath %>/deploy.tar.gz'
      },

      installDependencies: {
        command: 'cd <%= remote.sitePath %>/www && npm i --production && cd api && npm i --production && cd ../client && npm i --production'
      }
    },

    clean: {
      postDeploy: [ 'deploy.tar.gz' ]
    },

    hub: {
      clientCompile: {
        src: [ 'client/Gruntfile.js' ],
        tasks: [ 'compile' ]
      }
    }
  });

  //---------------------------
  // Load task modules
  //---------------------------

  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-hub');
  grunt.loadNpmTasks('grunt-ssh');

  //---------------------------
  // Register tasks
  //---------------------------

  grunt.registerTask('generate', [ 'hub:clientCompile' ]);
  grunt.registerTask('default', [ 'generate' ]);
  grunt.registerTask('deploy', [
    'generate',
    'compress',
    'sftp',
    'sshexec:clean',
    'sshexec:decompress',
    'sshexec:installDependencies',
    'sshexec:removePackage',
    'clean:postDeploy'
  ]);
};