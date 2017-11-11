module.exports = function(grunt) {
    var config = require('./.screeps.json');

    var branch = grunt.option('branch') || config.branch;
    var email = grunt.option('email') || config.email;
    var password = grunt.option('password') || config.password;
    var ptr = grunt.option('ptr') ? true : config.ptr;
    var private_directory = grunt.option('private_directory') || config.private_directory;

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-rsync');

    grunt.initConfig({
        screeps: {
            options: {
                email: email,
                password: password,
                branch: branch,
                ptr: ptr
            },
            dist: {
                src: ['src/*.js']
            }
        },
        rsync: {
            options: {
                args: ["--verbose", "--checksum"],
                exclude: [".git*"],
                recursive: true
            },
            private: {
                options: {
                    src: './src/*.js',
                    dest: private_directory,
                }
            },
        },
    });

    grunt.registerTask('default',  ['screeps']);
    grunt.registerTask('private',  ['rsync:private']);
}