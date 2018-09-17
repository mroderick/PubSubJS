<div align="center">
  <p>
    <h1> PubSubJS
  </p>

  <p>
    <a href="https://travis-ci.org/mroderick/PubSubJS"><img src="https://img.shields.io/travis/mroderick/PubSubJS.svg?style=flat-square" alt="Travis build status" title="Travis build status" /></a><!--
    --><a href="https://david-dm.org/mroderick/PubSubJS"><img src="https://img.shields.io/david/mroderick/pubsubjs.svg?style=flat-square" alt="Dependencies" title="Powered by David" /></a><!--
    --><a href="https://david-dm.org/mroderick/PubSubJS#info=devDependencies&view=table"><img src="https://img.shields.io/david/dev/mroderick/pubsubjs.svg?style=flat-square" alt="DevDependencies" title="Powered by David" /></a><!--
    --><a href="https://www.npmjs.com/package/pubsub-js"><img src="https://img.shields.io/npm/v/pubsub-js.svg?style=flat-square" alt="NPM version" title="Click to go to NPM" /></a><!--
    --><a href="https://github.com/mroderick/PubSubJS/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/pubsub-js.svg?style=flat-square" alt="MIT License" title="License" /></a><!--
    --><a href="https://www.npmjs.com/package/pubsub-js"><img src="https://img.shields.io/npm/dm/pubsub-js.svg?style=flat-square" alt="NPM downloads/month" title="Click to go to NPM" /></a><!--
    --><a href="https://coveralls.io/github/mroderick/PubSubJS"><img src="https://img.shields.io/coveralls/github/mroderick/PubSubJS.svg?style=flat-square" alt="Coverage Status" title="View Coverage"/></a>
  </p>
</div>

PubSubJS is a [topic-based](http://en.wikipedia.org/wiki/Publish–subscribe_pattern#Message_filtering) [publish/subscribe](http://en.wikipedia.org/wiki/Publish/subscribe) library written in JavaScript.

PubSubJS has synchronisation decoupling, so topics are published asynchronously. This helps keep your program predictable as the originator of topics will not be blocked while consumers process them.

For the adventurous, PubSubJS also supports synchronous topic publication. This can give a speedup in some environments (browsers, not all), but can also lead to some very difficult to reason about programs, where one topic triggers publication of another topic in the same execution chain.

#### Single process

PubSubJS is designed to be used within a **single process**, and is not a good candidate for multi-process applications (like [Node.js – Cluster](http://nodejs.org/api/cluster.html) with many sub-processes). If your Node.js app is a single process app, you're good. If it is (or is going to be) a multi-process app, you're probably better off using [redis Pub/Sub](http://redis.io/topics/pubsub) or similar

## Key features

* Dependency free
* synchronisation decoupling
* ES3 compatible. PubSubJS should be able to run everywhere that can execute JavaScript. Browsers, servers, ebook readers, old phones, game consoles.
* AMD / CommonJS module support
* No modification of subscribers (jQuery custom events modify subscribers)
* Easy to understand and use (thanks to synchronisation decoupling)
* Small(ish), less than 1kb minified and gzipped

## Getting PubSubJS

There are several ways of getting PubSubJS

* Install via npm (`npm install pubsub-js`)
* Use it directly from a CDN directly
    - http://www.jsdelivr.com/#!pubsubjs
    - https://cdnjs.com/libraries/pubsub-js
* [Download a tagged version](https://github.com/mroderick/PubSubJS/tags) from GitHub

**Note: the last version of this library available via bower is v1.5.4**

## Examples

First you have to import the module:

```javascript
import PubSub from 'pubsub-js'

// or when using CommonJS
const PubSub = require('pubsub-js');
```

### Basic example

```javascript
// create a function to subscribe to topics
var mySubscriber = function (msg, data) {
    console.log( msg, data );
};

// add the function to the list of subscribers for a particular topic
// we're keeping the returned token, in order to be able to unsubscribe
// from the topic later on
var token = PubSub.subscribe('MY TOPIC', mySubscriber);

// publish a topic asynchronously
PubSub.publish('MY TOPIC', 'hello world!');

// publish a topic synchronously, which is faster in some environments,
// but will get confusing when one topic triggers new topics in the
// same execution chain
// USE WITH CAUTION, HERE BE DRAGONS!!!
PubSub.publishSync('MY TOPIC', 'hello world!');
```

### Cancel specific subscription

```javascript
// create a function to receive the topic
var mySubscriber = function (msg, data) {
    console.log(msg, data);
};

// add the function to the list of subscribers to a particular topic
// we're keeping the returned token, in order to be able to unsubscribe
// from the topic later on
var token = PubSub.subscribe('MY TOPIC', mySubscriber);

// unsubscribe this subscriber from this topic
PubSub.unsubscribe(token);
```

### Cancel all subscriptions for a function

```javascript
// create a function to receive the topic
var mySubscriber = function(msg, data) {
    console.log(msg, data);
};

// unsubscribe mySubscriber from ALL topics
PubSub.unsubscribe(mySubscriber);
```

### Clear all subscriptions for a topic

```javascript
PubSub.subscribe('a', myFunc1);
PubSub.subscribe('a.b', myFunc2);
PubSub.subscribe('a.b.c', myFunc3);

PubSub.unsubscribe('a.b');
// no further notifications for 'a.b' and 'a.b.c' topics
// notifications for 'a' will still get published
```

### Clear all subscriptions

```javascript
PubSub.clearAllSubscriptions();
// all subscriptions are removed
```

### Hierarchical addressing

```javascript
// create a subscriber to receive all topics from a hierarchy of topics
var myToplevelSubscriber = function (msg, data) {
    console.log('top level: ', msg, data);
}

// subscribe to all topics in the 'car' hierarchy
PubSub.subscribe('car', myToplevelSubscriber);

// create a subscriber to receive only leaf topic from hierarchy op topics
var mySpecificSubscriber = function (msg, data) {
    console.log('specific: ', msg, data);
}

// subscribe only to 'car.drive' topics
PubSub.subscribe('car.drive', mySpecificSubscriber);

// Publish some topics
PubSub.publish('car.purchase', {name: 'my new car'});
PubSub.publish('car.drive', {speed: '14'});
PubSub.publish('car.sell', {newOwner: 'someone else'});

// In this scenario, myToplevelSubscriber will be called for all
// topics, three times in total
// But, mySpecificSubscriber will only be called once, as it only
// subscribes to the 'car.drive' topic
```

## Tips

Use "constants" for topics and not string literals. PubSubJS uses strings as topics, and will happily try to deliver your topics with ANY topic. So, save yourself from frustrating debugging by letting the JavaScript engine complain
when you make typos.

### Example of use of "constants"

```javascript
// 👎 Bad usage
PubSub.subscribe('hello', function (msg, data) {
	console.log(data)
});

PubSub.publish('hello', 'world');

// 👍 Better usage
var MY_TOPIC = 'hello';
PubSub.subscribe(MY_TOPIC, function (msg, data) {
	console.log(data)
});

PubSub.publish(MY_TOPIC, 'world');
```

### Example of use of "symbol constants" with ES6/7 syntax

```javascript
// event-types.js
export const MY_TOPIC = Symbol('MY_TOPIC')

// somefile.js
import { MY_TOPIC } from './event-types.js'
PubSub.subscribe(MY_TOPIC, function (msg, data) {
	console.log(data)
});

PubSub.publish(MY_TOPIC, 'world');
```

### Immediate Exceptions for stack traces in developer tools

As of version 1.3.2, you can force immediate exceptions (instead of delayed exceptions), which has the benefit of maintaining the stack trace when viewed in dev tools.

This should be considered a development only option, as PubSubJS was designed to try to deliver your topics to all subscribers, even when some fail.

Setting immediate exceptions in development is easy, just tell PubSubJS about it after it has been loaded.

```javascript
PubSub.immediateExceptions = true;
```

## Contributing to PubSubJS

Please see [CONTRIBUTING.md](CONTRIBUTING.md)


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