/*jslint white:true*/
/*global
	PubSub,
	buster,
	require,
	sinon,
	done
*/
(function( global ){
	"use strict";

	var PubSub = global.PubSub || require("../src/pubsub"),
		TestHelper = global.TestHelper || require("../test/helper"),
        assert = buster.assert;

	/**
	 *	This is a test proving that bug 54 has been fixed.
	 *	See https://github.com/mroderick/PubSubJS/issues/54
	 */
	buster.testCase( "Issue 54, publish method", {

		"should notify all subscribers, even when one is unsubscribed" : function( done ){
			var topic = TestHelper.getUniqueString(),
				token1,
				token1Unsubscribed = false,
				subscriber1 = function(){
					PubSub.unsubscribe(token1);
					token1Unsubscribed = true;
				},
				spy1 = sinon.spy(subscriber1),
				spy2 = this.spy(),
				spy3 = this.spy(),
				clock = this.useFakeTimers();

			token1 = PubSub.subscribe( topic, spy1 );
			PubSub.subscribe( topic, spy2 );
			PubSub.subscribe( topic, spy3 );

			PubSub.publish( topic );

			clock.tick(1);

			assert( token1Unsubscribed === true );
			assert( spy1.calledOnce );
			assert( spy2.calledOnce );
			assert( spy3.calledOnce );

			done();
			clock.restore();
		}
	});
}(this));
