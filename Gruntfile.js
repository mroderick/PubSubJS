/*jslint white:true*/
/*global
	module
*/
module.exports = function(grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({
		jslint: {
			files: [
				'src/**/*.js',
				'test/**/*.js'
			],

			exclude: [],

			options: {
				junit: 'out/junit.xml', // write the output to a JUnit XML
				log: 'out/lint.log',
				jslintXml: 'out/jslint_xml.xml',
				errorsOnly: true // only display errors
			}
		},

		buster: {
			test: {
				config: 'test/buster.js'
			},
			server: {
				port: 1111
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
	grunt.loadNpmTasks('grunt-jslint');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// override the built-in lint task with jslint
	grunt.registerTask('lint', 'jslint');

	grunt.registerTask('test', ['lint', 'buster']);

	// build jQuery version
	grunt.registerTask('jquery', 'concat:jquery');

	// Default task.
	grunt.registerTask('default', 'test');
};
