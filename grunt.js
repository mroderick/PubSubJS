/*jslint white:true*/
/*global 
	module
*/
module.exports = function(grunt) {

	'use strict';

	grunt.loadNpmTasks('grunt-buster');
	grunt.loadNpmTasks('grunt-jslint');

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
		}
	});

	// override the built-in lint task with jslint
	grunt.registerTask('lint', 'jslint');

	grunt.registerTask('test', 'lint buster');

	// Default task.
	grunt.registerTask('default', 'test');
};
