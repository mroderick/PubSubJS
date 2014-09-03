/*jslint white:true*/
/*global
	module,
	require
*/
var config = module.exports;
config["PubSubJS browser"] = {
	rootPath: "../",
	environment: "browser",
	sources: [
		"src/pubsub.js"
	],
	tests: [
		"test/helper.js",
		"test/test-*.js"
	]
};

config["PubSubJS - jQuery 1.7.2"] = {
	rootPath: "../",
	environment: "browser",

	libs: [
		"lib/jquery-1.7.2.js"
	],

	resources: [
		"src/pubsub.js",
		"wrappers/jquery/*",
		{
			path: "/jquery.pubsub.js",
			combine: [
				"wrappers/jquery/pubsub.js.pre.txt",
				"src/pubsub.js",
				"wrappers/jquery/pubsub.js.post.txt"
			]
		}
	],

	sources: ["/jquery.pubsub.js"],

	tests: [
		"test/helper.js",
		"test/test-*.js"
	]
};

config["Verify API"] = {
	rootPath: "../",
	environment: "browser",
	sources: [
		"src/pubsub.js"
	],
	tests: [
		"test/helper.js",
		"test/api/test-verify-api-global.js"
	]
};

config["Verify API (AMD)"] = {

	rootPath: "../",

	environment: "browser",

	libs: [
		"node_modules/requirejs/require.js",
		"lib/jquery-1.7.2.js"
	],

	resources: [
		"node_modules/jquery/dist/jquery.js",
		"src/pubsub.js",
		"wrappers/jquery/*",
		{
			path: "/jquery.pubsub.js",
			combine: [
				"wrappers/jquery/pubsub.js.pre.txt",
				"src/pubsub.js",
				"wrappers/jquery/pubsub.js.post.txt"
			]
		}
	],

	tests: [
		"test/helper.js",
		"test/api/test-*amd*.js"
	],

    extensions: [
        require("buster-amd")
    ]
};



/*
config["PubSubJS node"] = {
	rootPath: "../",
	environment: "node",
	sources: [
		"src/pubsub.js"
	],
	tests: [
		"test/helper.js",
		"test/test-*.js"
	]
};
*/
