(function( global ){
	"use strict";

	var $ = global.jQuery,
		PubSub = global.PubSub || require("../src/pubsub"),
		TestHelper = global.TestHelper || require("../test/helper"),
        assert = buster.assert;

	buster.testCase( "jQuery integration", {

		requiresSupportFor: { "jQuery": global.jQuery !== undefined },

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
		},

		"$.pubsub() reports errors to the console when one is available" : function(){
			var mock = this.mock( global.console );
			mock.expects( 'error' ).once().withArgs( new Error('Method bogus does not exist on jQuery.pubsub') );
			$.pubsub( 'bogus' );
		},

		"$.pubsub() reports errors with jQuery when the console is not available" : function(){
			var nativeConsole = global.console;
			try {
				var mock = this.mock( $ );
				global.console = undefined;
				mock.expects( 'error' ).once().withArgs( 'Method bogus does not exist on jQuery.pubsub' );
				$.pubsub( 'bogus' );
			} finally {
				global.console = nativeConsole;
			}
		}
	});
}(this));
