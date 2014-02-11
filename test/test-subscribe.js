/*jslint white:true, plusplus:true */
/*global
	PubSub,
	buster,
	require,
	sinon
*/
(function( global ){
	"use strict";

	var PubSub = global.PubSub || require("../src/pubsub"),
		TestHelper = global.TestHelper || require("../test/helper"),
        assert = buster.assert,
        refute = buster.refute;

	buster.testCase( "subscribe method", {

		"should return token as String" : function(){
			var func = function(){},
				message = TestHelper.getUniqueString(),
				token = PubSub.subscribe( message , func );

			assert.isString( token );
		},

		"should return new token for several subscriptions with same function" : function(){
			var func = function(){},
				tokens = [],
				iterations = 10,
				message = TestHelper.getUniqueString(),
				i;

			// build an array of tokens
			for ( i = 0; i < iterations; i++ ){
				tokens.push( PubSub.subscribe( message, func ) );
			}
			// make sure all tokens are different
			TestHelper.assertAllTokensDifferent( tokens );
		},

		"should return unique tokens for each namespaced subscription" : function(){
			var func = function(){},
				tokens = [],
				messages = ['library', 'library.music', 'library.music.jazz'],
				i;

			// build an array of tokens
			for ( i = 0; i < messages.length; i++ ){
				tokens.push( PubSub.subscribe( messages[i], func ) );
			}
			// make sure all tokens are different
			TestHelper.assertAllTokensDifferent( tokens );
		},

		"should return unique token for unique functions" : function(){
			var tokens = [],
				iterations = 10,
				message = TestHelper.getUniqueString(),
				i;

			function bakeFunc( value ){
				return function(){
					return value;
				};
			}

			// build an array of tokens, passing in a different function for each subscription
			for ( i = 0; i < iterations; i++ ){
				tokens.push( PubSub.subscribe( message, bakeFunc( i ) ) );
			}

			// make sure all tokens are different
			TestHelper.assertAllTokensDifferent( tokens );
		},

		'should return false when subscriber argument is not a function' : function(){
			var invalidSubscribers = [undefined, null, 'a string', 123, [], {}, new Date()],
				topic = TestHelper.getUniqueString(),
				i;

			for ( i = 0; i < invalidSubscribers.length; i++ ){
				assert.equals(PubSub.subscribe(topic, invalidSubscribers[i]), false);
			}

			assert.equals(i, invalidSubscribers.length);
		},

		'must not throw errors when publishing with invalid subscribers' : function(){
			var invalidSubscribers = [undefined, null, 'a string', 123, [], {}, new Date()],
				topic = TestHelper.getUniqueString(),
				i;

			for (i = 0; i < invalidSubscribers.length; i++){
				PubSub.subscribe(topic, invalidSubscribers[i]);
			}

			refute.exception(function(){
				PubSub.publish(topic, TestHelper.getUniqueString());
			});
		}
	});

}(this));
