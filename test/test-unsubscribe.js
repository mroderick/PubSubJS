(function( global ){
	"use strict";

	var PubSub = global.PubSub || require("../src/pubsub"),
		TestHelper = global.TestHelper || require("../test/helper"),
        assert = buster.assert,
        refute = buster.refute;

	buster.testCase( "unsubscribe method", {

		"should return token when succesful" : function(){
			var func = function(){ return undefined; },
				message = TestHelper.getUniqueString(),
				token = PubSub.subscribe( message, func),
				result = PubSub.unsubscribe( token );

			assert.equals( result, token );
		},

		"should return false when unsuccesful" : function(){
			var unknownToken = 'my unknown token',
				result = PubSub.unsubscribe( unknownToken ),
				func = function(){ return undefined; },
				message = TestHelper.getUniqueString(),
				token = PubSub.subscribe( message, func );

			// first, let's try a completely unknown token
			assert.equals( result, false );

			// now let's try unsubscribing the same method twice
			PubSub.unsubscribe( token );
			assert.equals( PubSub.unsubscribe( token ), false );
		},


		"with function argument should return true when succesful" : function(){
			var func = function(){ return undefined; },
				message = TestHelper.getUniqueString(),
				result;

			PubSub.subscribe( message, func);
			result = PubSub.unsubscribe( func );

			assert.equals( result, true );
		},

		"with function argument should return false when unsuccesful" : function(){
			var func = function(){ return undefined; },
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

		'with topic argument, must clear all exactly matched subscriptions': function(){
			var topic = TestHelper.getUniqueString(),
				spy1 = sinon.spy(),
				spy2 = sinon.spy();

			PubSub.subscribe(topic, spy1);
			PubSub.subscribe(topic, spy2);

			PubSub.unsubscribe(topic);

			PubSub.publishSync(topic, TestHelper.getUniqueString());

			refute(spy1.called);
			refute(spy2.called);
		},

		'with topic argument, must only clear matched subscriptions': function(){
			var topic1 = TestHelper.getUniqueString(),
				topic2 = TestHelper.getUniqueString(),
				spy1 = sinon.spy(),
				spy2 = sinon.spy();

			PubSub.subscribe(topic1, spy1);
			PubSub.subscribe(topic2, spy2);

			PubSub.unsubscribe(topic1);

			PubSub.publishSync(topic1, TestHelper.getUniqueString());
			PubSub.publishSync(topic2, TestHelper.getUniqueString());

			refute(spy1.called);
			assert(spy2.called);
		},

		'with topic argument, must clear all matched hierarchical subscriptions': function(){
			var topic = TestHelper.getUniqueString(),
				topicA = topic + '.a',
				topicB = topic + '.a.b',
				topicC = topic + '.a.b.c',
				spyA = sinon.spy(),
				spyB = sinon.spy(),
				spyC = sinon.spy();

			PubSub.subscribe(topicA, spyA);
			PubSub.subscribe(topicB, spyB);
			PubSub.subscribe(topicC, spyC);

			PubSub.unsubscribe(topicB);

			PubSub.publishSync(topicC, TestHelper.getUniqueString());

			assert(spyA.called);
			refute(spyB.called);
			refute(spyC.called);
		},

		'with parent topic argument, must clear all child subscriptions': function() {
			var topic = TestHelper.getUniqueString(),
				topicA = topic + '.a',
				topicB = topic + '.a.b',
				topicC = topic + '.a.b.c',
				spyB = sinon.spy(),
				spyC = sinon.spy();

			// subscribe only to  children:
			PubSub.subscribe(topicB, spyB);
			PubSub.subscribe(topicC, spyC);

			// but unsubscribe from a parent:
			PubSub.unsubscribe(topicA);

			PubSub.publishSync(topicB, TestHelper.getUniqueString());
			PubSub.publishSync(topicC, TestHelper.getUniqueString());

			refute(spyB.called);
			refute(spyC.called);
		},

		'must not throw exception when unsubscribing as part of publishing' : function(){
			refute.exception(function(){
				var topic = TestHelper.getUniqueString(),
					sub1 = function(){
						PubSub.unsubscribe(sub1);
					},
					sub2 = function(){ return undefined; };

				PubSub.subscribe( topic, sub1 );
				PubSub.subscribe( topic, sub2 );

				PubSub.publishSync( topic, 'hello world!' );
			});
		}
	});

}(this));
