# PubSubJS

PubSubJS is a dependency free library for doing [publish/subscribe](http://en.wikipedia.org/wiki/Publish/subscribe)
messaging in [JavaScript](https://developer.mozilla.org/en/JavaScript).

In order to not have surprising behaviour where the execution chain generates more than one message, 
publication of messages with PubSub are done asyncronously (this also helps keep your code responsive, by 
dividing work into smaller chunks, allowing the event loop to do it's business).

If you're feeling adventurous, you can also use syncronous message publication (speedup in browsers), which can lead 
to some very confusing conditions, when one message triggers publication of another message in the same execution chain.
Don't say I didn't warn you.

## Goals

* No dependencies
* No modification of subscribers (jQuery custom events modify subscribers)
* No use of DOM for exchanging messages
* No reliance of running in a browser (well the testsuite does, but meh)
* Easy to understand (messages are async by default)
* Small(ish)

## Examples

    // create a function to receive the message
    var mySubscriber = function( msg, data ){
        console.log( msg, data );
    };

    // add the function to the list of subscribers to a particular message
    // we're keeping the returned token, in order to be able to unsubscribe 
    // from the message later on
    var token = PubSub.subscribe( 'MY MESSAGE', mySubscriber );

    // publish a message asyncronously
    PubSub.publish( 'MY MESSAGE', 'hello world!' );
    
    // publish a message syncronously, which is faster by orders of magnitude,
    // but will get confusing when one message triggers new messages in the 
    // same execution chain
    // USE WITH CATTION, HERE BE DRAGONS!!!
    PubSub.publish( 'MY MESSAGE', 'hello world!', true );
    
    // unsubscribe from further messages, using setTimeout to allow for easy 
    // pasting of this code into an example :-)
    setTimeout(function(){
        PubSub.unsubscribe( token );
    }, 0);

## Minified version

The minified version is done with YUI Compressor (for safety), those that prefer other compressors already knows how to do this themselves :-)
    
## Testing

The tests are done using [JsTestDriver](http://code.google.com/p/js-test-driver/) and the excellent [Sinon.JS](http://cjohansen.no/sinon/). 

Provided are a couple of scripts to get you running (if you're on a unix based system and have Java installed).

* cd into `test`
* start the server by running `test/start-server.sh`
* connect a couple of browsers to [http://localhost:9876](http://localhost:9876)
* run the test suite by running `test/run-tests.sh`
