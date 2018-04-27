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

    describe('when user subscribes for all messages using this', function() {
        var message = TestHelper.getUniqueString(),
            subscribeFn = sinon.spy();

        PubSub.subscribeAll( subscribeFn );
        PubSub.publishSync( message, 'some payload' );

        assert( subscribeFn.calledOnce );
    });

} );
