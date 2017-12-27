'use strict';

var PubSub = require('../src/pubsub'),
    TestHelper = require('../test/helper'),
    assert = require('referee').assert,
    sinon = require('sinon');

/**
 *	This is a test proving that bug 54 has been fixed.
 *	See https://github.com/mroderick/PubSubJS/issues/54
 */
describe( 'Issue 54, publish method', function () {

    it('should notify all subscribers, even when one is unsubscribed', function( done ){
        var topic = TestHelper.getUniqueString(),
            token1,
            token1Unsubscribed = false,
            subscriber1 = function(){
                PubSub.unsubscribe(token1);
                token1Unsubscribed = true;
            },
            spy1 = sinon.spy(subscriber1),
            spy2 = sinon.spy(),
            spy3 = sinon.spy(),
            clock = sinon.useFakeTimers();

        token1 = PubSub.subscribe( topic, spy1 );
        PubSub.subscribe( topic, spy2 );
        PubSub.subscribe( topic, spy3 );

        PubSub.publish( topic );

        clock.tick(1);

        assert( token1Unsubscribed === true );
        assert( spy1.calledOnce );
        assert( spy2.calledOnce );
        assert( spy3.calledOnce );

        done();
        clock.restore();
    });
});
