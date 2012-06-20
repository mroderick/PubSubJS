/*jslint white:true, plusplus:true */
/*global
	PubSub,
	buster,
	assert,
	require,
	sinon
*/
(function( global ){
	"use strict";
	
	var PubSub = global.PubSub || require("../src/pubsub"),
		TestHelper = global.TestHelper || require("../test/test-helper"),
		EXPECTED_VERSION = "1.2.0";

	buster.testCase( "PubSub module", {		
		"should report version correctly" : function(){
			assert.equals( PubSub.version, EXPECTED_VERSION );
		}
	});
}(this));