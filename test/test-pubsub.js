/*jslint white:true, plusplus:true */
/*global
	PubSub,
	buster,
	assert,
	sinon
*/
(function( global ){
	"use strict";

	var EXPECTED_VERSION = "1.0.3";

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
		
		"test should report version correctly" : function(){
			assert.equals( PubSub.version, EXPECTED_VERSION );
		},		
		
		"test subscribe method should return token as String" : function(){
			var func = function(){},
				message = getUniqueString(),
				token = PubSub.subscribe( message , func );
			assert.typeOf( token, "string" );
		},
		
		"test subscribe method should return new token for several subscribtions with same function" : function(){
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
		
		"test subscribe method should return unique token for unique functions" : function(){
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

		"test publish method should return false if there are no subscribers" : function(){
			var message = getUniqueString();
			assert.equals( PubSub.publish( message ), false );
		},		  
		
		"test publish method should return true if there are subscribers to a message" : function(){
			var message = getUniqueString(),
				func = function(){};

			PubSub.subscribe( message, func );
			assert( PubSub.publish( message ) );
		},

		"test publish method should call all subscribers for a message exactly once" : function(){
			var message = getUniqueString(),
				spy1 = sinon.spy(),
				spy2 = sinon.spy();

			PubSub.subscribe( message, spy1 );
			PubSub.subscribe( message, spy2 );

			PubSub.publishSync( message, 'my payload' ); // force sync here, easier to test

			assert( spy1.calledOnce );
			assert( spy2.calledOnce );		  
		},

		"test publish method should call all ONLY subscribers of the published message" : function(){
			var message1 = getUniqueString(),
				message2 = getUniqueString(),
				spy1 = sinon.spy(),
				spy2 = sinon.spy();
				
			PubSub.subscribe( message1, spy1 );
			PubSub.subscribe( message2, spy2 );

			PubSub.publishSync( message1, 'some payload' );

			// ensure the first subscriber IS called
			assert(	 spy1.called );
			// ensure the second subscriber IS NOT called
			assert.equals( spy2.callCount, 0 );
		},
		
		"test publish method should call subscribers with message as first argument" : function(){
			var message = getUniqueString(),
				spy = sinon.spy();

			PubSub.subscribe( message, spy );		 
			PubSub.publishSync( message, 'some payload' );

			assert( spy.calledWith( message ) );		
		},

		"test publish method should call subscribers with data as second argument" : function(){
			var message = getUniqueString(),
				spy = sinon.spy(),
				data = getUniqueString();

			PubSub.subscribe( message, spy );		 
			PubSub.publishSync( message, data );

			assert( spy.calledWith( message, data ) );		  
		},
		
		"test publish method should publish method asyncronously" : function(){
			var setTimeout = sinon.stub( global, 'setTimeout' ),
				message = getUniqueString(),
				spy = sinon.spy(),
				data = getUniqueString();

			PubSub.subscribe( message, spy );		 
			PubSub.publish( message, data );

			assert( setTimeout.calledOnce );		

			setTimeout.restore();
		},
		
		"test publishSync method should allow syncronous publication" : function(){
			var setTimeout = sinon.stub( global, 'setTimeout' ),
				message = getUniqueString(),
				spy = sinon.spy(),
				data = getUniqueString();

			PubSub.subscribe( message, spy );		 
			PubSub.publishSync( message, data );

			// make sure that setTimeout was never called
			assert.equals( setTimeout.callCount, 0 );		 

			setTimeout.restore();
		},
		
		"test publish method should call all subscribers, even if there are exceptions" : function(){
			var message = getUniqueString(),
				func1 = function(){
					throw('some error');
				},
				spy1 = sinon.spy(),
				spy2 = sinon.spy();

			PubSub.subscribe( message, func1 );
			PubSub.subscribe( message, spy1 );
			PubSub.subscribe( message, spy2 );

			PubSub.publishSync( message, undefined );

			assert( spy1.called );		  
			assert( spy2.called );		  
		},

		"test unsubscribe method should return token when succesful" : function(){
			var func = function(){},
				message = getUniqueString(),
				token = PubSub.subscribe( message, func),
				result = PubSub.unsubscribe( token );
				
			assert.equals( result, token );		   
		},

		"test unsubscribe method should return false when unsuccesful" : function(){
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
		}
	});
}(this));