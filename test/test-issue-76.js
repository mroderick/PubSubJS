(function( global ){
	"use strict";

	var PubSub = global.PubSub || require("../src/pubsub"),
		TestHelper = global.TestHelper || require("../test/helper"),
        assert = buster.assert;

	buster.testCase( "Hierarchical addressing", {

		setUp : function(){
			this.clock = this.useFakeTimers();
		},

		tearDown: function(){
			this.clock.restore();
		},

		"unsubscribe method should unsubscribe a child and all its successors" : function( done ){
			var data = TestHelper.getUniqueString(),
				spy = this.spy(),
				messages = ['sequence', 'sequence.channel', 'sequence.channel.step'];

			PubSub.subscribe( messages[0], spy ); //This should be called
			PubSub.subscribe( messages[1], spy ); //Gets unsubscribed
			PubSub.subscribe( messages[2], spy ); //This should be called

			PubSub.unsubscribe( messages[1], true );

			PubSub.publish( messages[2], data );

			this.clock.tick(1);
			assert.equals( spy.callCount, 1 );

			done();
		}

	});

}(this));

