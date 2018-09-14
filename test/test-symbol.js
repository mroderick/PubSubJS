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
});
