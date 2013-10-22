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
            moduleBaseUrl: 'app'

        },
        baseFile: 'app/_index.html'
    }
    });

    // Load required modules
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks("grunt-assetbuild");

};


