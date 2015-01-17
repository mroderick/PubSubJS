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
