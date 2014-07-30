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

	buster.testCase( 'clearAllSubscriptions method', {
		'must clear all subscriptions' : function(){
			var topic = TestHelper.getUniqueString(),
				spy1 = sinon.spy(),
				spy2 = sinon.spy();

			PubSub.subscribe(topic, spy1);
			PubSub.subscribe(topic, spy2);

			PubSub.clearAllSubscriptions();

			PubSub.publishSync(topic, TestHelper.getUniqueString());

			refute(spy1.called);
			refute(spy2.called);
		}
	});
}(this));
