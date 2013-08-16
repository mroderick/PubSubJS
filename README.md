# PubSubJS

[![Build Status](https://travis-ci.org/mroderick/PubSubJS.png)](https://travis-ci.org/mroderick/PubSubJS) [![NPM version](https://badge.fury.io/js/pubsub-js.png)](http://badge.fury.io/js/pubsub-js)

PubSubJS is a dependency free [publish/subscribe](http://en.wikipedia.org/wiki/Publish/subscribe) library for [JavaScript](https://developer.mozilla.org/en/JavaScript).

PubSubJS has synchronisation decoupling, so messages are delivered asynchronously. This helps keep your program predictable as the originator of messages will not be blocked while consumers process messages.

For the adventurous, PubSubJS also supports synchronous message publication. This can give a speedup in some environments (browsers, not all), but can also lead to some very difficult to reason about programs, when one message triggers publication of another message in the same execution chain.

For benchmarks, see [A Comparison of JS Publish/Subscribe Approaches](http://jsperf.com/pubsubjs-vs-jquery-custom-events/51)

## Key features

* Dependency free
* Synchronization decoupling
* ES3 compatible. PubSubJS should be able to run everywhere that can execute JavaScript. Browsers, servers, ebook readers, old phones, game consoles.
* AMD / CommonJS module support
* No modification of subscribers (jQuery custom events modify subscribers)
* Easy to understand and use (thanks to synchronization decoupling)
* Small(ish), less than 1kb minified and gzipped

## Getting PubSubJS

There are several ways of getting PubSubJS

* [Download a tagged version](https://github.com/mroderick/PubSubJS/tags) from GitHub
* Install via npm (`npm install pubsub-js`)
* Intall via bower (`bower install pubsub-js`)

## Examples

### Basic example

```javascript
// create a function to receive messages
var mySubscriber = function( msg, data ){
    console.log( msg, data );
};

// add the function to the list of subscribers for a particular message
// we're keeping the returned token, in order to be able to unsubscribe
// from the message later on
var token = PubSub.subscribe( 'MY MESSAGE', mySubscriber );

// publish a message asyncronously
PubSub.publish( 'MY MESSAGE', 'hello world!' );

// publish a message syncronously, which is faster in some environments,
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

### Immediate Exceptions for stack traces in developer tools

As of versions 1.3.2, you can force immediate exceptions (instead of delayed execeptions), which has the benefit of maintaining the stack trace when viewed in dev tools.

This should be considered a development only option, as PubSubJS was designed to try to deliver your topics to all subscribers, even when some fail.

Setting immediate exceptions in development is easy, just tell PubSubJS about it after it's been loaded.

```javascript
PubSub.immediateExceptions = true;
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
var token = $.pubsub('subscribe', topic, subscriber );

// unsubscribing
$.pubsub('unsubscribe', token)          // remove a specific subscription
$.pubsub('unsubscribe', subscriber);    // remove all subscriptions for subscriber

// publishing a topic
$.pubsub('publish', topic, data);

// publishing topic syncronously
$.pubsub('publishSync', topic, data);
```

In the jQuery build, the global ```PubSub``` global is still available, so you can mix and match both ```Pubsub``` and ```$.pubsub``` as needed.

There is also an article about [Using PubSubJS with jQuery](http://roderick.dk/resources/using-pubsubjs-with-jquery/)

## Development

There are grunt tasks for helping with linting and testing the codebase.

### Test setup

The tests are implemented using [BusterJS](http://busterjs.org) and the excellent [Sinon.JS](http://cjohansen.no/sinon/). You will need to install BusterJS in order to run the tests.

### Linting

```bash
$ grunt lint
```

### Testing with PhantomJS

If you have PhantomJS installed on your system, you can run the Buster tests by running

```bash
$ grunt test
```

or by running
```bash
$ npm test
```

## Future of PubSubJS

* Build script to create the following wrappers
	* Ender.js wrapper
* Better and more extensive usage examples

## More about Publish/Subscribe

* [The Many Faces of Publish/Subscribe](http://www.cs.ru.nl/~pieter/oss/manyfaces.pdf) (PDF)
* [Addy Osmani's mini book on Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript)
* [Publish / Subscribe Systems, A summary of 'The Many Faces of Publish / Subscribe'](http://downloads.ohohlfeld.com/talks/hohlfeld_schroeder-publish_subscribe_systems-dsmware_eurecom2007.pdf)

## Versioning

PubSubJS uses [Semantic Versioning](http://semver.org/) for predictable versioning.

## Changelog

Please see [https://github.com/mroderick/PubSubJS/releases](https://github.com/mroderick/PubSubJS/releases)

## License

MIT: http://mrgnrdrck.mit-license.org

## Alternatives

These are a few alternative projects that also implement topic based publish subscribe in JavaScript.

* http://www.joezimjs.com/projects/publish-subscribe-jquery-plugin/
* http://amplifyjs.com/api/pubsub/
* http://radio.uxder.com/ — oriented towards 'channels', free of dependencies
* https://github.com/pmelander/Subtopic - supports vanilla, underscore, jQuery and is even available in NuGet