module.exports = {

	// a list of paths to the files you want linted
	paths: [ 
		"./src/**/*.js",
		"./test/**/*.js",
	],		

	// 'jslint' or 'jshint'
	linter: "jslint",

	// see default-configuration.js for a list of all options				
  	linterOptions: {
  		maxlen		: 240,
  		plusplus	: true,
  		white		: true,

  		// a list of known global variables
		predef: []
  	},

  	// a list of strings/regexes matching filenames that should not be linted
  	excludes: []

};