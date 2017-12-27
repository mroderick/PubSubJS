'use strict';

var PubSub = require('../src/pubsub'),
    TestHelper = require('../test/helper'),
    assert = require('referee').assert,
    refute = require('referee').refute,
    sinon = require('sinon');

describe( 'publish method', function () {
    it('should return false if there are no subscribers', function(){
        var message = TestHelper.getUniqueString();
        assert.equals( PubSub.publish( message ), false );
    });

    it('should return true if there are subscribers to a message', function(){
        var message = TestHelper.getUniqueString(),
            func = function(){ return undefined; };

        PubSub.subscribe( message, func );
        assert( PubSub.publish( message ) );
    });

    it('should return false, when there are no longer any subscribers to a message', function(){
        var message = TestHelper.getUniqueString(),
            func = function(){ return undefined; },
            token = PubSub.subscribe(message, func);

        PubSub.unsubscribe(token);
        assert.equals( PubSub.publish(message), false );
    });

    it('should call all subscribers for a message exactly once', function(){
        var message = TestHelper.getUniqueString(),
            spy1 = sinon.spy(),
            spy2 = sinon.spy();

        PubSub.subscribe( message, spy1 );
        PubSub.subscribe( message, spy2 );

        PubSub.publishSync( message, 'my payload' ); // force sync here, easier to test

        assert( spy1.calledOnce );
        assert( spy2.calledOnce );
    });

    it('should call all ONLY subscribers of the published message', function(){
        var message1 = TestHelper.getUniqueString(),
            message2 = TestHelper.getUniqueString(),
            spy1 = sinon.spy(),
            spy2 = sinon.spy();

        PubSub.subscribe( message1, spy1 );
        PubSub.subscribe( message2, spy2 );

        PubSub.publishSync( message1, 'some payload' );

        // ensure the first subscriber IS called
        assert(	 spy1.called );
        // ensure the second subscriber IS NOT called
        assert.equals( spy2.callCount, 0 );
    });

    it('should call subscribers with message as first argument', function(){
        var message = TestHelper.getUniqueString(),
            spy = sinon.spy();

        PubSub.subscribe( message, spy );
        PubSub.publishSync( message, 'some payload' );

        assert( spy.calledWith( message ) );
    });

    it('should call subscribers with data as second argument', function(){
        var message = TestHelper.getUniqueString(),
            spy = sinon.spy(),
            data = TestHelper.getUniqueString();

        PubSub.subscribe( message, spy );
        PubSub.publishSync( message, data );

        assert( spy.calledWith( message, data ) );
    });

    it('should publish method asyncronously', function( done ){
        var message = TestHelper.getUniqueString(),
            spy = sinon.spy(),
            data = TestHelper.getUniqueString(),
            clock = sinon.useFakeTimers();

        PubSub.subscribe( message, spy );
        PubSub.publish( message, data );

        assert.equals( spy.callCount, 0 );
        clock.tick(1);
        assert.equals( spy.callCount, 1 );

        done();
        clock.restore();
    });

    it('publishSync method should allow syncronous publication', function(){
        var message = TestHelper.getUniqueString(),
            spy = sinon.spy(),
            data = TestHelper.getUniqueString();

        PubSub.subscribe( message, spy );
        PubSub.publishSync( message, data );

        assert.equals( spy.callCount, 1 );
    });

    it('should call all subscribers, even if there are exceptions', function( done ){
        var message = TestHelper.getUniqueString(),
            func1 = function(){
                throw('some error');
            },
            spy1 = sinon.spy(),
            spy2 = sinon.spy(),
            clock = sinon.useFakeTimers();

        PubSub.subscribe( message, func1 );
        PubSub.subscribe( message, spy1 );
        PubSub.subscribe( message, spy2 );

        assert.exception( function(){
            PubSub.publishSync( message, 'some data' );
            clock.tick(1);
        });

        assert( spy1.called );
        assert( spy2.called );

        done();
        clock.restore();
    });

    it('should fail immediately on exceptions when immediateExceptions is true', function(){
        var message = TestHelper.getUniqueString(),
            func1 = function(){
                throw('some error');
            },
            spy1 = sinon.spy(),
            spy2 = sinon.spy();


        PubSub.subscribe( message, func1 );
        PubSub.subscribe( message, spy1 );

        PubSub.immediateExceptions = true;

        assert.exception( function(){
            PubSub.publishSync( message, 'some data' );
        });

        refute( spy1.called );
        refute( spy2.called );

        // make sure we restore PubSub to it's original state
        delete PubSub.immediateExceptions;
    });

    it('should fail immediately on exceptions in namespaces when immediateExceptions is true',  function(){
        var func1 = function(){
                throw('some error');
            },
            spy1 = sinon.spy();

        PubSub.subscribe( 'buy', func1 );
        PubSub.subscribe( 'buy', spy1 );

        PubSub.immediateExceptions = true;

        assert.exception( function(){
            PubSub.publishSync( 'buy.tomatoes', 'some data' );
        });

        refute( spy1.called );

        // make sure we restore PubSub to it's original state
        delete PubSub.immediateExceptions;
    });

    it('should call all subscribers, even when there are unsubscriptions within', function(done){
        var topic = TestHelper.getUniqueString(),
            spy1 = sinon.spy(),
            func1 = function func1(){
                PubSub.unsubscribe(func1);
                spy1();
            },

            spy2 = sinon.spy(),
            func2 = function func2(){
                PubSub.unsubscribe(func2);
                spy2();
            },

            clock = sinon.useFakeTimers();

        PubSub.subscribe(topic, func1);
        PubSub.subscribe(topic, func2);

        PubSub.publish(topic, 'some data');
        clock.tick(1);

        assert(spy1.called, 'expected spy1 to be called');
        assert(spy2.called, 'expected spy2 to be called');

        clock.restore();
        done();
    });
});
