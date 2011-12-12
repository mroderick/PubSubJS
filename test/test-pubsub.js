(function( global ){
    "use strict";

    // helps us make sure that the order of the tests have no impact on their succes
    var getUniqueString = function(){
        if ( getUniqueString.uid === undefined ){
            getUniqueString.uid = 0;
        }    
        getUniqueString.uid++;

        return "my unique String number " + getUniqueString.uid.toString();
    };

    // makes sure that all tokens in the passed array are different
    var assertAllTokensDifferent = function( tokens ){
        var length = tokens.length;
        assert( tokens.length > 0 );
        // compare all tokens
        for ( var j = 0; j < length; j++ ){
            for ( var k = j + 1; k < length; k++ ){
                assert( tokens[j] !== tokens[k] );
            }
        }

        // make sure we actually tested something
        assert.equals( j, length );
        assert.equals( k, length );
    };

    buster.testCase( "PubSub", {
        
        "test subscribe method should return token as String" : function(){
            var func = function(){};
            var message = getUniqueString();
            var token = PubSub.subscribe( message , func );
            assert.typeOf( token, "string" );
        },
        
        "test subscribe method should return new token for several subscribtions with same function" : function(){
            var func = function(){};
            var tokens = [];
            var iterations = 10;
            var message = getUniqueString();

            // build an array of tokens
            for ( var i = 0; i < iterations; i++ ){
                tokens.push( PubSub.subscribe( message, func ) );
            }
            // make sure all tokens are different
            assertAllTokensDifferent( tokens );
        },
        
        "test subscribe method should return unique token for unique functions" : function(){
            var tokens = [];
            var iterations = 10;
            var message = getUniqueString();

            // build an array of tokens, passing in a different function for each subscription
            for ( var i = 0; i < iterations; i++ ){
                var func = (function( value ){
                    return function(){
                        return value;
                    };
                }(i));
                tokens.push( PubSub.subscribe( message, func ) );
            }

            // make sure all tokens are different
            assertAllTokensDifferent( tokens );        
        },

        "test publish method should return false if there are no subscribers" : function(){
            var message = getUniqueString();
            assert.equals( PubSub.publish( message ), false );
        },        
        
        "test publish method should return true if there are subscribers to a message" : function(){
            var message = getUniqueString();
            var func = function(){};

            PubSub.subscribe( message, func );
            assert( PubSub.publish( message ) );
        },

        "test publish method should call all subscribers for a message exactly once" : function(){
            var message = getUniqueString();

            var spy1 = sinon.spy();
            PubSub.subscribe( message, spy1 );

            var spy2 = sinon.spy();
            PubSub.subscribe( message, spy2 );

            PubSub.publishSync( message, 'my payload' ); // force sync here, easier to test

            assert( spy1.calledOnce );
            assert( spy2.calledOnce );        
        },

        "test publish method should call all ONLY subscribers of the published message" : function(){
            var message1 = getUniqueString();
            var message2 = getUniqueString();

            var spy1 = sinon.spy();
            PubSub.subscribe( message1, spy1 );

            var spy2 = sinon.spy();
            PubSub.subscribe( message2, spy2 );

            PubSub.publishSync( message1, 'some payload' );

            // ensure the first subscriber IS called
            assert(  spy1.called );
            // ensure the second subscriber IS NOT called
            assert.equals( spy2.callCount, 0 );
        },
        
        "test publish method should call subscribers with message as first argument" : function(){
            var message = getUniqueString();
            var spy = sinon.spy();

            PubSub.subscribe( message, spy );        
            PubSub.publishSync( message, 'some payload' );

            assert( spy.calledWith( message ) );        
        },

        "test publish method should call subscribers with data as second argument" : function(){
            var message = getUniqueString();
            var spy = sinon.spy();
            var data = getUniqueString();

            PubSub.subscribe( message, spy );        
            PubSub.publishSync( message, data );

            assert( spy.calledWith( message, data ) );        
        },
        
        "test publish method should publish method asyncronously" : function(){
            var setTimeout = sinon.stub( global, 'setTimeout' );

            var message = getUniqueString();
            var spy = sinon.spy();
            var data = getUniqueString();

            PubSub.subscribe( message, spy );        
            PubSub.publish( message, data );

            assert( setTimeout.calledOnce );        

            setTimeout.restore();
        },
        
        "test publishSync method should allow syncronous publication" : function(){
            var setTimeout = sinon.stub( global, 'setTimeout' );

            var message = getUniqueString();
            var spy = sinon.spy();
            var data = getUniqueString();

            PubSub.subscribe( message, spy );        
            PubSub.publishSync( message, data );

            // make sure that setTimeout was never called
            assert.equals( setTimeout.callCount, 0 );        

            setTimeout.restore();
        },
        
        "test publish method should call all subscribers, even if there are exceptions" : function(){
            var message = getUniqueString();
            var error = getUniqueString();
            var func1 = function(){
                throw('some error');
            };
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();

            PubSub.subscribe( message, func1 );
            PubSub.subscribe( message, spy1 );
            PubSub.subscribe( message, spy2 );

            PubSub.publishSync( message, undefined );

            assert( spy1.called );        
            assert( spy2.called );        
        },

        "test unsubscribe method should return token when succesful" : function(){
            var func = function(){};
            var message = getUniqueString();
            var token = PubSub.subscribe( message, func);

            var result = PubSub.unsubscribe( token );
            assert.equals( result, token );        
        },

        "test unsubscribe method should return false when unsuccesful" : function(){

            // first, let's try a completely unknown token
            var unknownToken = 'my unknown token';
            var result = PubSub.unsubscribe( unknownToken );
            assert.equals( result, false );

            // now let's try unsubscribing the same method twice
            var func = function(){};
            var message = getUniqueString();
            var token = PubSub.subscribe( message, func );

            // unsubscribe once
            PubSub.unsubscribe( token );
            // unsubscribe again
            assert.equals( PubSub.unsubscribe( token ), false );        
        },
        
        "test should report version correctly" : function(){
            var expectedVersion = "1.0.1";
            assert.equals( PubSub.version, expectedVersion );
        }
    });
}(this));