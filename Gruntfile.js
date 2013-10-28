module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        less:{
            development: {
                files: [{
                    expand: true,        // Enable dynamic expansion.
                    cwd: 'app/styles',  // Src matches are relative to this path.
                    src: ['*.less'],     // Actual pattern(s) to match.
                    dest: 'app/dist/styles',  // Destination path prefix.
                    ext: '.css'         // Dest filepaths will have this extension.
                }]
            }
        },

        assetbuild: {
            options: {
                moduleBaseUrl: 'app',
                baseJson: 'mortar.json',
                baseFile: '_index.html'
            },
            dev:{
                options: {
                    livereload: true
                }
            },
            prod:{
                options: {
                    livereload: false
                }
            }


        },

        copy: {
            css:{
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'app',
                        src: ['lib/css/*.css'],
                        dest: 'app/dist/styles'
                    }
                ]
            },
            images: {
                files: [
                    {
                        expand: true,
                        cwd: 'app',
                        src: ['images/*.{gif,png,jpg,jpeg}'],
                        dest: 'app/dist'
                    }
                ]
            }
        },
        emberTemplates: {
            main: {
                files: {
                    'app/dist/scripts/templates.js': 'app/scripts/view/templates/*.hbs'
                }
            },
            options: {
                templateBasePath: /app\/scripts\/view\/templates\//
            }
        },
        watch: {
            options: {
                livereload: true
            },
            styles: {
                files: ['app/styles/*.less'],
                tasks: ['less:development'],
                options: {
                    nospawn: true,
                    debounceDelay: 250,
                    livereload: true
                }
            },
            modules: {
                files: ['app/mortar.json', 'app/_index.html'],
                tasks: ['assetbuild:generate']
            },
            templates: {
                files: ['app/scripts/view/templates/*.hbs'],
                tasks: ['emberTemplates:main']
            }
        }
        });

        // Load required modules
        grunt.loadNpmTasks('grunt-contrib-less');
        grunt.loadNpmTasks("grunt-assetbuild");
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-ember-templates');


        grunt.registerTask('default', ['less', 'assetbuild:dev', 'copy', 'emberTemplates', 'watch']);
        grunt.registerTask('prod', ['less', 'assetbuild:prod', 'copy', 'emberTemplates']);


};


