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
        generate:{
            options: {
                moduleBaseUrl: 'app',
                baseJson: 'mortar.json',
                baseFile: '_index.html'
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
    }
    });

    // Load required modules
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks("grunt-assetbuild");
    grunt.loadNpmTasks('grunt-contrib-copy');

};


