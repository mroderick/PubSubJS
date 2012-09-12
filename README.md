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
* No reliance of running in a browser
* Easy to understand (messages are async by default)
* Small(ish)
* Compatible! ES3 compatible, should be able to run everywhere that can execute JavaScript
* AMD / CommonJS module

## Examples

### Basic example

```javascript
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
// USE WITH CAUTION, HERE BE DRAGONS!!!
PubSub.publishSync( 'MY MESSAGE', 'hello world!' );
```    

### Cancel specific subscripiton

```javascript
// create a function to receive the message
var mySubscriber = function( msg, data ){
    console.log( msg, data );
};

// add the function to the list of subscribers to a particular message
// we're keeping the returned token, in order to be able to unsubscribe 
// from the message later on
var token = PubSub.subscribe( 'MY MESSAGE', mySubscriber );

// unsubscribe from further messages
PubSub.unsubscribe( token );
```

### Cancel all subscriptions for a function

```javascript
// create a function to receive the message
var mySubscriber = function( msg, data ){
    console.log( msg, data );
};

// add the function to the list of subscribers to a particular message
// we're keeping the returned token, in order to be able to unsubscribe 
// from the message later on
var token = PubSub.subscribe( 'MY MESSAGE', mySubscriber );

// unsubscribe mySubscriber from ALL further messages
PubSub.unsubscribe( mySubscriber );
```

### Hierarchical addressing

```javascript
// create a subscriber to receive all messages from a hierarchy of topics
var myToplevelSubscriber = function( msg, data ){
    console.log( 'top level: ', msg, data );
}

// subscribe to all topics in the 'car' hierarchy
PubSub.subscribe( 'car', myToplevelSubscriber );


// create a subscriber to receive only leaf message from hierarchy op topics
var mySpecificSubscriber = function( msg, data ){
    console.log('specific: ', msg, data );
}

// subscribe only to 'car.drive' topics
PubSub.subscribe( 'car.drive', mySpecificSubscriber );


// Publish some topics
PubSub.publish( 'car.purchase', { name : 'my new car' } );
PubSub.publish( 'car.drive', { speed : '14' } );
PubSub.publish( 'car.sell', { newOwner : 'someone else' } );

// In this scenario, myToplevelSubscriber will be called for all 
// topics, three times in total
// But, mySpecificSubscriber will only be called once, as it only
// subscribes to the 'car.drive' topic
```


## Tips

Use "constants" for topics and not string literals. PubSubJS uses strings as topics, and will happily try to deliver 
your messages with ANY topic. So, save yourself from frustrating debugging by letting the JavaScript engine complain
when you make typos.

### Example of use of "constants"

```javascript
// BAD
PubSub.subscribe("hello", function( msg, data ){ 
	console.log( data ) 
});

PubSub.publish("helo", "world");

// BETTER
var MY_TOPIC = "hello";
PubSub.subscribe(MY_TOPIC, function( msg, data ){ 
	console.log( data ) 
});

PubSub.publish(MY_TOPIC, "world");
```

## Plugin for jQuery

By default PubSubJS can be used in any browser or CommonJS environment, including [node](http://nodejs.org). Additionally, PubSubJS can be built specifically for jQuery.

    $ rake jquery

Produces jquery.pubsub.js

### Use with jQuery


```javascript
var topic = 'greeting',
    data = 'world'
    subscriber = function sayHello( data ){
        console.log( 'hello ' + data );
    };

// add a subscription
var token = $.pubsub('subscribe', topic, sayHello );

// unsubscribing
$.pubsub('unsubscribe', token)          // remove a specific subscription
$.pubsub('unsubscribe', subscriber);    // remove all subscriptions for subscriber

// publishing a topic
$.pubsub('publish', topic, data);

// publishing topic syncronously
$.pubsub('publishSync', topic, data);
```

## Testing
The tests are implemented using [BusterJS](http://busterjs.org) and the excellent [Sinon.JS](http://cjohansen.no/sinon/). 

**Note:** Before running the tests, you should [download jQuery 1.7.2](http://code.jquery.com/jquery-1.7.2.js) and put it in the lib folder.

## Future of PubSubJS

* Build script to create the following wrappers
	* Ender.js wrapper
* Better and more extensive usage examples

## More about Publish/Subscribe

* [The Many Faces of Publish/Subscribe](http://www.cs.ru.nl/~pieter/oss/manyfaces.pdf) (PDF)
* [Addy Osmani's mini book on Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript)

## Versioning

PubSubJS uses [Semantic Versioning](http://semver.org/) for predictable versioning.

## Changelog
* v1.3.0
    * Added jQuery plugin via rake task
* v1.2.2
    * Fix issue 9, where a subscriber would not get notified, if there were no subscribers above it in hierarchy.
* v1.2.0
    * Remove all subscriptions for a function (@mrgnrdrck)
* v1.1.0
    * Hierarchical addressing of topics ("namespacing") (@jgauffin, @fideloper)
* v1.0.3
	* AMD / CommonJS module support (@fernandogmar)
	
## License

MIT: http://mrgnrdrck.mit-license.org

## Alternatives

These are a few alternative projects that also implement topic based publish subscribe in JavaScript.

* http://www.joezimjs.com/projects/publish-subscribe-jquery-plugin/
* http://amplifyjs.com/api/pubsub/
* http://radio.uxder.com/ — oriented towards 'channels', free of dependencies