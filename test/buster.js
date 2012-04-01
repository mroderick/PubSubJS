var config = module.exports;
config["PubSubJS browser"] = {
	rootPath: "../",
    environment: "browser",
    sources: [
        "src/pubsub.js"
    ],
    tests: [
        "test/test-pubsub.js"
    ]
}

config["PubSubJS node"] = {
	rootPath: "../",
    environment: "node",
    sources: [
        "src/pubsub.js"
    ],
    tests: [
        "test/test-pubsub.js"
    ]
}