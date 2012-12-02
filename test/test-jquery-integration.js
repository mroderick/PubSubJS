/*jslint white:true*/
/*global
	PubSub,
	buster,
	assert,
	require,
	sinon
*/
(function( global ){
	"use strict";
	
	var $ = global.jQuery,
		PubSub = global.PubSub || require("../src/pubsub"),
		TestHelper = global.TestHelper || require("../test/helper");

	buster.testCase( "jQuery integration", {

		requiresSupportFor: { "jQuery": global.jQuery !== undefined },

		"should expose version string comprised of name and version of PubSub" : function(){
			assert.equals( PubSub.name + ' ' + PubSub.version, $.pubsub.version );
		},

		"$.pubsub('subscribe') should call subscribe" : function(){
			var topic = TestHelper.getUniqueString(),
				spy = this.spy(),
				mock = this.mock( PubSub );

			mock.expects('subscribe').once().withArgs( topic, spy );

			$.pubsub('subscribe', topic, spy);

			assert( mock.verify() );
		},

		"$.pubsub('unsubscribe') should call unsubscribe" : function(){
			var subscriber = this.spy(),
				mock = this.mock( PubSub );

			mock.expects( 'unsubscribe' ).once().withArgs( subscriber );
			
			$.pubsub( 'unsubscribe', subscriber );

			assert( mock.verify() );
		},

		"$.pubsub('publish') should call publish" : function(){
			var topic = TestHelper.getUniqueString(),
				data = TestHelper.getUniqueString(),
				mock = this.mock( PubSub );

			mock.expects( 'publish' ).once().withArgs( topic, data );

			$.pubsub( 'publish', topic, data );

			assert( mock.verify() );	
		},

		"$.pubsub('publishSync') should call publishSync" : function(){
			var topic = TestHelper.getUniqueString(),
				data = TestHelper.getUniqueString(),
				mock = this.mock( PubSub );

			mock.expects( 'publishSync' ).once().withArgs( topic, data );

			$.pubsub( 'publishSync', topic, data );

			assert( mock.verify() );	
		}
	});
}(this));