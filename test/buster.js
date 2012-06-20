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
}

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
}