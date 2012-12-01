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
	
	var PubSub = global.PubSub || require("../src/pubsub"),
		TestHelper = global.TestHelper || require("../test/helper");

	buster.testCase( "Hierarchical addressing", {

		setUp : function(){
			this.clock = this.useFakeTimers();
		},
		
		tearDown: function(){
			this.clock.restore();
		},

		"publish method should not call any children in a namespace" : function( done ) {
			var messages = ['library', 'library.music'],
				spy = this.spy(),
				data = TestHelper.getUniqueString();
			
			
			PubSub.subscribe( messages[0], spy ); //This should be called
			PubSub.subscribe( messages[1], spy );
			PubSub.publish( messages[0], data );

			assert.equals( spy.callCount, 0 );
			this.clock.tick(1);		
			assert.equals( spy.callCount, 1 );
			
			done();
		},
		
		"publish method should call a parent namespace" : function( done ) {
			// Publishing library.music should trigger parent library
			var messages = ['library', 'library.music'],
				spy = this.spy(),
				data = TestHelper.getUniqueString();
			
			
			PubSub.subscribe( messages[0], spy ); //This should be called
			PubSub.subscribe( messages[1], spy ); //This should be called
			PubSub.publish( messages[1], data );

			assert.equals( spy.callCount, 0 );
			this.clock.tick(1);		
			assert.equals( spy.callCount, 2 );
			
			done();
		},
		
		"publish method should call only a parent namespace" : function( done ) {
			//Publishing library.music should only trigger parents descendants
			//Even if it has a child
			var messages = ['library', 'library.music', 'library.music.jazz'],
				spy = this.spy(),
				data = TestHelper.getUniqueString();
			
			
			PubSub.subscribe( messages[0], spy ); //This should be called
			PubSub.subscribe( messages[1], spy ); //This should be called
			PubSub.subscribe( messages[2], spy );
			PubSub.publish( messages[1], data );

			assert.equals( spy.callCount, 0 );
			this.clock.tick(1);		
			assert.equals( spy.callCount, 2 );
			
			done();
		},
		
		"publish method should call all parent namespaces" : function( done ) {
			//Publishing library.music.jazz should trigger all parents
			var messages = ['library', 'library.music', 'library.music.jazz'],
				spy = this.spy(),
				data = TestHelper.getUniqueString();
			
			
			PubSub.subscribe( messages[0], spy ); //This should be called
			PubSub.subscribe( messages[1], spy ); //This should be called
			PubSub.subscribe( messages[2], spy ); //This should be called
			PubSub.publish( messages[2], data );

			assert.equals( spy.callCount, 0 );
			this.clock.tick(1);		
			assert.equals( spy.callCount, 3 );
			
			done();
		},
		
		"publish method should call only parent descendants" : function( done ) {
			//Publishing library.music.jazz should trigger only all parents descendants
			//Skipping library.playlist and library.playlist.*
			var messages = [
					'library',
					'library.music',
					'library.music.jazz',
					'library.playlist',
					'library.playlist.mine'
				],
				spy = this.spy(),
				data = TestHelper.getUniqueString();
			
			PubSub.subscribe( messages[0], spy ); //This should be called
			PubSub.subscribe( messages[1], spy ); //This should be called
			PubSub.subscribe( messages[2], spy ); //This should be called
			PubSub.subscribe( messages[3], spy );
			PubSub.subscribe( messages[4], spy );
			PubSub.publish( messages[2], data );

			assert.equals( spy.callCount, 0 );
			this.clock.tick(1);		
			assert.equals( spy.callCount, 3 );
			
			done();
		},
		
		"publish method should call all parent descendants deeply" : function( done ) {
			//Publishing library.music.jazz.soft.swing should trigger all but
			//library.music.playlist.jazz
			var messages = [
					'library',
					'library.music',
					'library.music.jazz',
					'library.music.jazz.soft',
					'library.music.jazz.soft.swing',
					'library.music.playlist.jazz'
				],
				spy = this.spy(),
				data = TestHelper.getUniqueString();
			
			
			PubSub.subscribe( messages[0], spy ); //This should be called
			PubSub.subscribe( messages[1], spy ); //This should be called
			PubSub.subscribe( messages[2], spy ); //This should be called
			PubSub.subscribe( messages[3], spy ); //This should be called
			PubSub.subscribe( messages[4], spy ); //This should be called
			PubSub.subscribe( messages[5], spy ); //This should be called
			PubSub.subscribe( messages[6], spy );
			PubSub.publish( messages[4], data );

			assert.equals( spy.callCount, 0 );
			this.clock.tick(1);		
			assert.equals( spy.callCount, 5 );
			
			done();
		},
		
		"publish method should still call all parents, even when middle child is unsubscribed" : function( done ) {
			
			var messages = ['library', 'library.music', 'library.music.jazz'],
				spy = this.spy(),
				data = TestHelper.getUniqueString(),
				token;
			
			
			PubSub.subscribe( messages[0], spy ); //This should be called
			PubSub.subscribe( messages[2], spy ); //This should be called

			token = PubSub.subscribe( messages[1], spy );
			
			PubSub.unsubscribe( token ); //Take out middle child
			
			PubSub.publish( messages[2], data );

			assert.equals( spy.callCount, 0 );
			this.clock.tick(1);		
			assert.equals( spy.callCount, 2 );
			
			done();
		},

		"unsubscribe method should return tokens when succesfully removing namespaced message" : function(){
			var func = function(){},
				messages = ['playlist.music', 'playlist.music.jazz'],
				token1 = PubSub.subscribe( messages[0], func),
				token2 = PubSub.subscribe( messages[1], func ),
				result1 = PubSub.unsubscribe( token1 ),
				result2 = PubSub.unsubscribe( token2 );
				
			assert.equals( result1, token1 );
			assert.equals( result2, token2 );  
		},
		
		"unsubscribe method should unsubscribe parent without affecting orphans" : function( done ){
			var data = TestHelper.getUniqueString(),
				spy = this.spy(),
				messages = ['playlist', 'playlist.music', 'playlist.music.jazz'],
				token, result;

			token = PubSub.subscribe( messages[0], spy ); //Gets unsubscribed
			PubSub.subscribe( messages[1], spy ); //This should be called
			PubSub.subscribe( messages[2], spy ); //This should be called
			
			result = PubSub.unsubscribe( token );
			
			PubSub.publish( messages[2], data );
			
			assert.equals( spy.callCount, 0 );
			this.clock.tick(1);		
			assert.equals( spy.callCount, 2 );
			
			done();
		}

	});

}(this));