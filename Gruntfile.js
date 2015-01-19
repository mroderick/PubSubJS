module.exports = function(grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({
		buster: {
			test: {
				config: 'test/buster.js'
			}
		},

		concat: {
			options: {
				// overrides the default linefeed separator
				separator: ''
			},
			jquery: {
				src: ['wrappers/jquery/pubsub.js.pre.txt', 'src/pubsub.js', 'wrappers/jquery/pubsub.js.post.txt'],
				dest: 'jquery.pubsub.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-buster');
	grunt.loadNpmTasks('grunt-contrib-concat');


	grunt.registerTask('test', ['buster']);

	// build jQuery version
	grunt.registerTask('jquery', 'concat:jquery');

	// Default task.
	grunt.registerTask('default', 'test');
};
