(function( global ){
	"use strict";

	var PubSub = global.PubSub || require("../src/pubsub"),
        assert = buster.assert;

	buster.testCase( "expose PubSub factory", {

		"should expose PubSub factory" : function( done ){
			var subscriber1 = this.spy(),
				subscriber2 = this.spy(),
				newPubSub = {},
				clock = this.useFakeTimers();

			PubSub.factory( newPubSub );

			PubSub.subscribe( 'a', subscriber1 );
			newPubSub.subscribe( 'a', subscriber2 );

			newPubSub.publish( 'a' );

			clock.tick(1);

			assert( !subscriber1.called );
			assert( subscriber2.calledOnce );

			done();
			clock.restore();
		}
	});
}(this));
