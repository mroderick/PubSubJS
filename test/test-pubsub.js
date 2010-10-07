TestCase( "PubSub", {
    "test subscribe method should return token as String" : function(){
        var func = function(){};
        var message = getUniqueString();
        var token = PubSub.subscribe( message , func );
        assertString( token );
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
        assertFalse( PubSub.publish( message ) );
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
        
        PubSub.publish( message, 'my payload', true ); // force sync here, easier to test
        
        assert( 'first subscriber called once', spy1.calledOnce );
        assert( 'second subscriber called once', spy2.calledOnce );        
    },
    
    "test publish method should call all ONLY subscribers of the published message" : function(){
        var message1 = getUniqueString();
        var message2 = getUniqueString();

        var spy1 = sinon.spy();
        PubSub.subscribe( message1, spy1 );

        var spy2 = sinon.spy();
        PubSub.subscribe( message2, spy2 );
        
        PubSub.publish( message1, 'some payload', true );

        // ensure the first subscriber IS called
        assert( 'first subscriber called', spy1.called );
        // ensure the second subscriber IS NOT called
        assertEquals( 'second subscriber NOT called', 0, spy2.callCount );
    },
    
    "test publish method should call subscribers with message as first argument" : function(){
        var message = getUniqueString();
        var spy = sinon.spy();

        PubSub.subscribe( message, spy );        
        PubSub.publish( message, 'some payload', true );
        
        assert( spy.calledWith( message ) );        
    },
    
    "test publish method should call subscribers with data as second argument" : function(){
        var message = getUniqueString();
        var spy = sinon.spy();
        var data = getUniqueString();

        PubSub.subscribe( message, spy );        
        PubSub.publish( message, data, true );
        
        assert( spy.calledWith( message, data ) );        
    },
    
    "test publish method should publish method asyncronously by default" : function(){
        var stub = sinon.stub( window, 'setTimeout' );

        var message = getUniqueString();
        var spy = sinon.spy();
        var data = getUniqueString();

        PubSub.subscribe( message, spy );        
        PubSub.publish( message, data );
        
        assert( stub.calledOnce );        
        
        stub.restore();
    },
    
    "test publish method should allow syncronous publication" : function(){
        var stub = sinon.stub( window, 'setTimeout' );

        var message = getUniqueString();
        var spy = sinon.spy();
        var data = getUniqueString();

        PubSub.subscribe( message, spy );        
        PubSub.publish( message, data, true );
        
        // make sure that setTimeout was never called
        assertEquals( 0, stub.callCount );        
        
        stub.restore();
    },
    
    "test publish method should call all subscribers, even if there are exeptions" : function(){
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

        PubSub.publish( message, undefined, true );
        
        assert( spy1.called );        
        assert( spy2.called );        
    },
    
    "test unsubscribe method should return token when succesful" : function(){
        var func = function(){};
        var message = getUniqueString();
        var token = PubSub.subscribe( message, func);
        
        var result = PubSub.unsubscribe( token );
        assertEquals( token, result );        
    },
    
    "test unsubscribe method should return false when unsuccesful" : function(){
        
        // first, let's try a completely unknown token
        var unknownToken = 'my unknown token';
        var result = PubSub.unsubscribe( unknownToken );
        assertFalse( result );
        
        // now let's try unsubscribing the same method twice
        var func = function(){};
        var message = getUniqueString();
        var token = PubSub.subscribe( message, func );

        // unsubscribe once
        PubSub.unsubscribe( token );
        // unsubscribe again
        assertFalse( PubSub.unsubscribe( token ) );        
    }
});

// helps us make sure that the order of the tests have no impact on their succes
var getUniqueString = function(){
    if ( this.uid === undefined ){
        this.uid = 0;
    }    
    this.uid++;

    return "my unique String number " + this.uid.toString();
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
    assertEquals( length, j );
    assertEquals( length, k );
};