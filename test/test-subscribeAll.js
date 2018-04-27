'use strict';

var PubSub = require('../src/pubsub'),
    TestHelper = require('../test/helper'),
    assert = require('referee').assert,
    sinon = require('sinon');


describe( 'subscribeAll method', function() {

    it('should return token as String', function(){
        var func = function(){ return undefined; },
            token = PubSub.subscribeAll( func );

        assert.isString( token );
    });

    it('should subscribe for all messages', function() {
        var message = TestHelper.getUniqueString(),
            subscribeFn = sinon.spy();

        PubSub.subscribeAll( subscribeFn );
        PubSub.publishSync( message, 'some payload' );

        assert( subscribeFn.calledOnce );
    });

} );
