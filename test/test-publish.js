/*jslint white:true, stupid:true*/
/*global
	PubSub,
	buster,
	require,
	sinon
*/
(function( global ){
	"use strict";

	var PubSub = global.PubSub || require("../src/pubsub"),
		TestHelper = global.TestHelper || require("../test/helper"),
        assert = buster.assert,
        refute = buster.refute;

	buster.testCase( "publish method", {

		"publish method should return false if there are no subscribers" : function(){
			var message = TestHelper.getUniqueString();
			assert.equals( PubSub.publish( message ), false );
		},

		"publish method should return true if there are subscribers to a message" : function(){
			var message = TestHelper.getUniqueString(),
				func = function(){};

			PubSub.subscribe( message, func );
			assert( PubSub.publish( message ) );
		},

		"should return false, when there are no longer any subscribers to a message" : function(){
			var message = TestHelper.getUniqueString(),
				func = function(){},
				token = PubSub.subscribe(message, func);

			PubSub.unsubscribe(token);
			assert.equals( PubSub.publish(message), false );
		},

		"publish method should call all subscribers for a message exactly once" : function(){
			var message = TestHelper.getUniqueString(),
				spy1 = this.spy(),
				spy2 = this.spy();

			PubSub.subscribe( message, spy1 );
			PubSub.subscribe( message, spy2 );

			PubSub.publishSync( message, 'my payload' ); // force sync here, easier to test

			assert( spy1.calledOnce );
			assert( spy2.calledOnce );
		},

		"publish method should call all ONLY subscribers of the published message" : function(){
			var message1 = TestHelper.getUniqueString(),
				message2 = TestHelper.getUniqueString(),
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
			var message = TestHelper.getUniqueString(),
				spy = this.spy();

			PubSub.subscribe( message, spy );
			PubSub.publishSync( message, 'some payload' );

			assert( spy.calledWith( message ) );
		},

		"publish method should call subscribers with data as second argument" : function(){
			var message = TestHelper.getUniqueString(),
				spy = this.spy(),
				data = TestHelper.getUniqueString();

			PubSub.subscribe( message, spy );
			PubSub.publishSync( message, data );

			assert( spy.calledWith( message, data ) );
		},

		"publish method should publish method asyncronously" : function( done ){
			var message = TestHelper.getUniqueString(),
				spy = this.spy(),
				data = TestHelper.getUniqueString(),
				clock = this.useFakeTimers();

			PubSub.subscribe( message, spy );
			PubSub.publish( message, data );

			assert.equals( spy.callCount, 0 );
			clock.tick(1);
			assert.equals( spy.callCount, 1 );

			done();
			clock.restore();
		},

		"publishSync method should allow syncronous publication" : function(){
			var message = TestHelper.getUniqueString(),
				spy = this.spy(),
				data = TestHelper.getUniqueString();

			PubSub.subscribe( message, spy );
			PubSub.publishSync( message, data );

			assert.equals( spy.callCount, 1 );
		},

		"publish method should call all subscribers, even if there are exceptions" : function( done ){
			var message = TestHelper.getUniqueString(),
				func1 = function(){
					throw('some error');
				},
				spy1 = this.spy(),
				spy2 = this.spy(),
				clock = this.useFakeTimers();

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
		},

		"publish method should fail immediately on exceptions when immediateExceptions is true" : function(){
			var message = TestHelper.getUniqueString(),
				func1 = function(){
					throw('some error');
				},
				spy1 = this.spy(),
				spy2 = this.spy();


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
		},

		"publish should call all subscribers, even when there are unsubscriptions within" : function(done){
			var topic = TestHelper.getUniqueString(),
				spy1 = this.spy(),
				func1 = function func1(){
					PubSub.unsubscribe(func1);
					spy1();
				},

				spy2 = this.spy(),
				func2 = function func2(){
					PubSub.unsubscribe(func2);
					spy2();
				},

				clock = this.useFakeTimers();

			PubSub.subscribe(topic, func1);
			PubSub.subscribe(topic, func2);

			PubSub.publish(topic, 'some data');
			clock.tick(1);

			assert(spy1.called, 'expected spy1 to be called');
			assert(spy2.called, 'expected spy2 to be called');

			clock.restore();
			done();
		}
	});
}(this));
