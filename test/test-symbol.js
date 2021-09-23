/* global Symbol */
'use strict';

var PubSub = require('../src/pubsub'),
    assert = require('referee').assert;

describe( 'subscribe and publish', function() {
    before(function(){
        if (typeof Symbol !== 'function'){
            this.skip();
        }
    });
    it('should work on Symbol() type message/topic', function(){
        var MESSAGE = Symbol('MESSAGE');
        var func = function(){ return undefined; };

        PubSub.subscribe( MESSAGE, func );
        
        assert( PubSub.publish( MESSAGE ), true );
    });
    it("should call func1 only once", function () {
        var MESSAGE1 = Symbol("MESSAGE");
        var MESSAGE2 = Symbol("MESSAGE");
        var count = 0;
        var func1 = function (msg) {
            count++;
            assert(count === 1, true);
            return undefined;
        };

        PubSub.subscribe(MESSAGE1, func1);

        PubSub.publish(MESSAGE1);
        PubSub.publish(MESSAGE2);
    });
});
