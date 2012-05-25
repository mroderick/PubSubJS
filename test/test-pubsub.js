/*jslint white:true, plusplus:true */
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
		EXPECTED_VERSION = "1.1.0-dev";

	// helps us make sure that the order of the tests have no impact on their succes
	function getUniqueString(){
		if ( getUniqueString.uid === undefined ){
			getUniqueString.uid = 0;
		}	 
		getUniqueString.uid++;

		return "my unique String number " + getUniqueString.uid.toString();
	}

	// makes sure that all tokens in the passed array are different
	function assertAllTokensDifferent( tokens ){
		var length = tokens.length,
			j, k;
		assert( tokens.length > 0 );
		// compare all tokens
		for ( j = 0; j < length; j++ ){
			for ( k = j + 1; k < length; k++ ){
				assert( tokens[j] !== tokens[k] );
			}
		}

		// make sure we actually tested something
		assert.equals( j, length );
		assert.equals( k, length );
	}

	buster.testCase( "PubSub", {
		
		setUp : function(){
			this.clock = this.useFakeTimers();
		},
		
		tearDown: function(){
			this.clock.restore();
		},
		
		"should report version correctly" : function(){
			assert.equals( PubSub.version, EXPECTED_VERSION );
		},		
		
		"subscribe method should return token as String" : function(){
			var func = function(){},
				message = getUniqueString(),
				token = PubSub.subscribe( message , func );

			assert.isString( token );
		},
		
		"subscribe method should return new token for several subscriptions with same function" : function(){
			var func = function(){},
				tokens = [],
				iterations = 10,
				message = getUniqueString(),
				i;

			// build an array of tokens
			for ( i = 0; i < iterations; i++ ){
				tokens.push( PubSub.subscribe( message, func ) );
			}
			// make sure all tokens are different
			assertAllTokensDifferent( tokens );
		},
		
		"subscribe method should return unique tokens for each namespaced subscription" : function(){
			var func = function(){},
				tokens = [],
				messages = ['library', 'library.music', 'library.music.jazz'],
				i;

			// build an array of tokens
			for ( i = 0; i < messages.length; i++ ){
				tokens.push( PubSub.subscribe( messages[i], func ) );
			}
			// make sure all tokens are different
			assertAllTokensDifferent( tokens );
		},
		
		"subscribe method should return unique token for unique functions" : function(){
			var tokens = [],
				iterations = 10,
				message = getUniqueString(),
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
			assertAllTokensDifferent( tokens );		   
		},

		"publish method should return false if there are no subscribers" : function(){
			var message = getUniqueString();
			assert.equals( PubSub.publish( message ), false );
		},		  
		
		"publish method should return true if there are subscribers to a message" : function(){
			var message = getUniqueString(),
				func = function(){};

			PubSub.subscribe( message, func );
			assert( PubSub.publish( message ) );
		},

		"publish method should call all subscribers for a message exactly once" : function(){
			var message = getUniqueString(),
				spy1 = this.spy(),
				spy2 = this.spy();

			PubSub.subscribe( message, spy1 );
			PubSub.subscribe( message, spy2 );

			PubSub.publishSync( message, 'my payload' ); // force sync here, easier to test

			assert( spy1.calledOnce );
			assert( spy2.calledOnce );		  
		},

		"publish method should call all ONLY subscribers of the published message" : function(){
			var message1 = getUniqueString(),
				message2 = getUniqueString(),
				spy1 = this.spy(),
				spy2 = this.spy();
				
			PubSub.subscribe( message1, spy1 );
			PubSub.subscribe( message2, spy2 );

			PubSub.publishSync( message1, 'some payload' );

			// ensure the first subscriber IS called
			assert(	 spy1.called );
			// ensure the second subscriber IS NOT called
			assert.equals( spy2.callCount, 0 );
		},
		
		"publish method should call subscribers with message as first argument" : function(){
			var message = getUniqueString(),
				spy = this.spy();

			PubSub.subscribe( message, spy );		 
			PubSub.publishSync( message, 'some payload' );

			assert( spy.calledWith( message ) );		
		},

		"publish method should call subscribers with data as second argument" : function(){
			var message = getUniqueString(),
				spy = this.spy(),
				data = getUniqueString();

			PubSub.subscribe( message, spy );		 
			PubSub.publishSync( message, data );

			assert( spy.calledWith( message, data ) );		  
		},
		
		"publish method should publish method asyncronously" : function( done ){
			var message = getUniqueString(),
				spy = this.spy(),
				data = getUniqueString();

			PubSub.subscribe( message, spy );		 
			PubSub.publish( message, data );

			assert.equals( spy.callCount, 0 );
			this.clock.tick(1);		
			assert.equals( spy.callCount, 1 );
			
			done();
		},
		
		"publishSync method should allow syncronous publication" : function(){
			var message = getUniqueString(),
				spy = this.spy(),
				data = getUniqueString();

			PubSub.subscribe( message, spy );		 
			PubSub.publishSync( message, data );

			assert.equals( spy.callCount, 1 );
		},
		
		"publish method should call all subscribers, even if there are exceptions" : function(){
			var message = getUniqueString(),
				func1 = function(){
					throw('some error');
				},
				spy1 = this.spy(),
				spy2 = this.spy();

			PubSub.subscribe( message, func1 );
			PubSub.subscribe( message, spy1 );
			PubSub.subscribe( message, spy2 );

			PubSub.publishSync( message, undefined );

			assert( spy1.called );		  
			assert( spy2.called );		  
		},
		
		"publish method should not call any children in a namespace" : function( done ) {
			var messages = ['library', 'library.music'],
				spy = this.spy(),
				data = getUniqueString();
			
			
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
				data = getUniqueString();
			
			
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
				data = getUniqueString();
			
			
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
				data = getUniqueString();
			
			
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
			var messages = ['library', 'library.music', 'library.music.jazz', 'library.playlist', 'library.playlist.mine'],
				spy = this.spy(),
				data = getUniqueString();
			
			
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
			var messages = ['library', 'library.music', 'library.music.jazz', 'library.music.jazz.soft', 'library.music.jazz.soft.swing', 'library.music.playlist.jazz'],
				spy = this.spy(),
				data = getUniqueString();
			
			
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
				data = getUniqueString();
			
			
			var token1 = PubSub.subscribe( messages[0], spy ); //This should be called
			var token2 = PubSub.subscribe( messages[1], spy );
			var token3 = PubSub.subscribe( messages[2], spy ); //This should be called
			
			PubSub.unsubscribe( token2 ); //Take out middle child
			
			PubSub.publish( messages[2], data );

			assert.equals( spy.callCount, 0 );
			this.clock.tick(1);		
			assert.equals( spy.callCount, 2 );
			
			done();
		},

		"unsubscribe method should return token when succesful" : function(){
			var func = function(){},
				message = getUniqueString(),
				token = PubSub.subscribe( message, func),
				result = PubSub.unsubscribe( token );
				
			assert.equals( result, token );		   
		},

		"unsubscribe method should return false when unsuccesful" : function(){
			var unknownToken = 'my unknown token',
				result = PubSub.unsubscribe( unknownToken ),
				func = function(){},
				message = getUniqueString(),
				token = PubSub.subscribe( message, func );

			// first, let's try a completely unknown token
			assert.equals( result, false );

			// now let's try unsubscribing the same method twice
			PubSub.unsubscribe( token );
			assert.equals( PubSub.unsubscribe( token ), false );		
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
			var func = function(){},
				data = getUniqueString(),
				spy = this.spy(),
				messages = ['playlist', 'playlist.music', 'playlist.music.jazz'],
				token1 = PubSub.subscribe( messages[0], spy ), //Gets unsubscribed
				token2 = PubSub.subscribe( messages[1], spy ), //This should be called
				token3 = PubSub.subscribe( messages[2], spy ), //This should be called
				result1 = PubSub.unsubscribe( token1 );
			
			PubSub.publish( messages[2], data );
			
			assert.equals( spy.callCount, 0 );
			this.clock.tick(1);		
			assert.equals( spy.callCount, 2 );
			
			done();
		}
		
	});
}(this));