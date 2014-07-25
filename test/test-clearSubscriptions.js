/*jslint white:true, stupid:true*/
/*global
	PubSub,
	buster,
	require,
	sinon,
	console
*/
(function( global ){
	'use strict';

	var PubSub = global.PubSub || require('../src/pubsub'),
		TestHelper = global.TestHelper || require('../test/helper'),
        assert = buster.assert,
        refute = buster.refute,
        NOOP = function(){};

	buster.testCase( 'clearSubscriptions method', {

		'must be a function' : function(){
			assert.isFunction( PubSub.clearSubscriptions );
		},

		'when passed "*" must clear all subscriptions' : function(){
			var topic = TestHelper.getUniqueString(),
				spy1 = sinon.spy(),
				spy2 = sinon.spy();

			PubSub.subscribe(topic, spy1);
			PubSub.subscribe(topic, spy2);

			PubSub.clearSubscriptions('*');

			PubSub.publishSync(topic, TestHelper.getUniqueString());

			refute(spy1.called);
			refute(spy2.called);
		},

		'must clear all exactly matched subscriptions': function(){
			var topic = TestHelper.getUniqueString(),
				spy1 = sinon.spy(),
				spy2 = sinon.spy();

			PubSub.subscribe(topic, spy1);
			PubSub.subscribe(topic, spy2);

			PubSub.clearSubscriptions(topic);

			PubSub.publishSync(topic, TestHelper.getUniqueString());

			refute(spy1.called);
			refute(spy2.called);
		},

		'must only clear matched subscriptions': function(){
			var topic1 = TestHelper.getUniqueString(),
				topic2 = TestHelper.getUniqueString(),
				spy1 = sinon.spy(),
				spy2 = sinon.spy();

			PubSub.subscribe(topic1, spy1);
			PubSub.subscribe(topic2, spy2);

			PubSub.clearSubscriptions(topic1);

			PubSub.publishSync(topic1, TestHelper.getUniqueString());
			PubSub.publishSync(topic2, TestHelper.getUniqueString());

			refute(spy1.called);
			assert(spy2.called);
		},

		'must clear all matched hierarchical subscriptions': function(){
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

			PubSub.clearSubscriptions(topicB);

			PubSub.publishSync(topicA, TestHelper.getUniqueString());

			assert(spyA.called);
			refute(spyB.called);
			refute(spyC.called);
		}
	});

}(this));
