/*jslint white:true, stupid:true*/
/*global
	PubSub,
	buster,
	assert,
	refute,
	require,
	sinon
*/
(function( global ){
	"use strict";

	var PubSub = global.PubSub || require("../src/pubsub"),
		TestHelper = global.TestHelper || require("../test/helper");

	buster.testCase( "unsubscribe method", {

		"should return token when succesful" : function(){
			var func = function(){},
				message = TestHelper.getUniqueString(),
				token = PubSub.subscribe( message, func),
				result = PubSub.unsubscribe( token );

			assert.equals( result, token );
		},

		"should return false when unsuccesful" : function(){
			var unknownToken = 'my unknown token',
				result = PubSub.unsubscribe( unknownToken ),
				func = function(){},
				message = TestHelper.getUniqueString(),
				token = PubSub.subscribe( message, func );

			// first, let's try a completely unknown token
			assert.equals( result, false );

			// now let's try unsubscribing the same method twice
			PubSub.unsubscribe( token );
			assert.equals( PubSub.unsubscribe( token ), false );
		},


		"with function argument should return true when succesful" : function(){
			var func = function(){},
				message = TestHelper.getUniqueString(),
				result;

			PubSub.subscribe( message, func);
			result = PubSub.unsubscribe( func );

			assert.equals( result, true );
		},

		"with function argument should return false when unsuccesful" : function(){
			var func = function(){},
				message = TestHelper.getUniqueString(),
				unknownToken = 'my unknown token',
				result = PubSub.unsubscribe( unknownToken );

			// first, let's try a completely unknown token

			assert.equals( result, false );

			// now let's try unsubscribing the same method twice
			PubSub.subscribe( message, func );
			PubSub.subscribe( message, func );
			PubSub.subscribe( message, func );

			// unsubscribe once, this should remove all subscriptions for message
			PubSub.unsubscribe( func );

			// unsubscribe again
			assert.equals( PubSub.unsubscribe( func ), false );
		},

		'must not throw exception when unsubscribing as part of publishing' : function(){
			refute.exception(function(){
				var topic = TestHelper.getUniqueString(),
					sub1 = function(){
						PubSub.unsubscribe(sub1);
					},
					sub2 = function(){};

				PubSub.subscribe( topic, sub1 );
				PubSub.subscribe( topic, sub2 );

				PubSub.publishSync( topic, 'hello world!' );
			});
		}
	});

}(this));