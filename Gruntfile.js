module.exports = function (grunt) {

    [
        'grunt-cafe-mocha',
        'grunt-contrib-jshint',
        'grunt-exec',
	    'grunt-link-checker'
    ].forEach(function (task) {
        grunt.loadNpmTasks(task);
    });

    grunt.initConfig({
        cafemocha:{
            all: {
                src: 'qa/test-*.js',
                options: {
                    ui: 'tdd'
                }
            }
        },
        jshint: {
            app: [
                'app.js',
                'public/qa/*.js',
                'lib/**/*.js'
            ]
        },
	linkChecker: {
	  dev: {
	    site: 'localhost',
	    options: {
	      initialPort: 30000
	    }
	  }
	}
    });
    grunt.registerTask('default',['cafemocha', 'jshint', 'linkChecker'])
}
