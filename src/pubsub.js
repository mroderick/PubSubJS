/*
Copyright (c) 2010,2011,2012 Morgan Roderick http://roderick.dk
License: MIT – http://mrgnrdrck.mit-license.org
*/
/*jslint white:true, plusplus:true */
/*global
	setTimeout,
	module,
	exports,
	define
*/
/** section: PubSub
 *	PubSubJS is a dependency free library for doing ['publish/subscribe'](http://en.wikipedia.org/wiki/Publish/subscribe)
 *	messaging in JavaScript.
 *	
 *	In order to not have surprising behaviour where the execution chain generates more than one message, 
 *	publication of messages with PubSub are done asyncronously (this also helps keep your code responsive, by 
 *	dividing work into smaller chunks, allowing the event loop to do it's business).
 *
 *	If you're feeling adventurous, you can also use syncronous message publication, which can lead to some very
 *	confusing conditions, when one message triggers publication of another message in the same execution chain.
 *	Don't say I didn't warn you.
 * 
 *	##### Examples
 *	
 *		// create a function to receive the message
 *		var mySubscriber = function( msg, data ){
 *			console.log( msg, data );
 *		};
 * 
 *		// add the function to the list of subscribers to a particular message
 *		// we're keeping the returned token, in order to be able to unsubscribe from the message later on
 *		var token = PubSub.subscribe( 'MY MESSAGE', mySubscriber );
 *
 *		// publish a message asyncronously
 *		PubSub.publish( 'MY MESSAGE', 'hello world!' );
 *		
 *		// publish a message syncronously, which is faster by orders of magnitude, but will get confusing
 *		// when one message triggers new messages in the same execution chain
 *		// USE WITH CATTION, HERE BE DRAGONS!!!
 *		PubSub.publishSync( 'MY MESSAGE', 'hello world!' );
 *		
 *		// unsubscribe from further messages, using setTimeout to allow for easy pasting of this code into an example :-)
 *		setTimeout(function(){
 *			PubSub.unsubscribe( token );
 *		}, 0)
**/ 
(function(root){
	"use strict";
	
	var PubSub = {
			version: "1.0.4-dev"
		},
		messages = {},
		lastUid = -1;
	
	// Export the PubSub object for **Node.js** and **"CommonJS"**, with
	// backwards-compatibility for the old `require()` API. If we're not in
	// CommonJS, add `PubSub` to the global object via a string identifier for
	// the Closure Compiler "advanced" mode. Registration as an AMD module
	// via define() happens at the end of this file.
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = PubSub;
		}
		exports.PubSub = PubSub;
	} else {
		root.PubSub = PubSub;
	}

	function publish( message, data, sync ){
		// if there are no subscribers to this message, just return here
		if ( !messages.hasOwnProperty( message ) ){
            // check upper levels
            var found = false;
            namespaceIterator(message, function(name) {
                found = messages.hasOwnProperty( name );
                if (found){ 
                    return false;
                }
                return true;
            });
            
            if (!found) {
                return false;
            }
        }
        
        function namespaceIterator(name, func) {
            var found = false;
            var pos = name.lastIndexOf('.');
            while (pos !== -1){
                name = name.substr(0, pos);
                if (!func(name))
                    break;
                pos = name.lastIndexOf('.')
            }
        }
        
        function deliverNamespaced(){
            if (messages.hasOwnProperty( message )) {
                deliverMessage(message, message);
            }
            namespaceIterator(message, function(name) {
                if (messages.hasOwnProperty( name )) {
                    deliverMessage(message, name);
                }
                return true;
            });
        }
		
		function deliverMessage(originalMessage, matchedMessage){
            var subscribers = messages[matchedMessage],
				throwException = function(e){
	                return function(){
	                    throw e;
	                };
	            },
				i, j; 
            for ( i = 0, j = subscribers.length; i < j; i++ ){
                try {
                    subscribers[i].func( originalMessage, data );
                } catch( e ){
                    setTimeout( throwException(e), 0);
                }
            }
        }

        if ( sync === true ){
            deliverNamespaced();
        } else {
            setTimeout( deliverNamespaced, 0 );
        }
        return true;
	}

	/**
	 *	PubSub.publish( message[, data] ) -> Boolean
	 *	- message (String): The message to publish
	 *	- data: The data to pass to subscribers
	 *	- sync (Boolean): Forces publication to be syncronous, which is more confusing, but faster
	 *	Publishes the the message, passing the data to it's subscribers
	**/
	PubSub.publish = function( message, data ){
		return publish( message, data, false );
	};

	/**
	 *	PubSub.publishSync( message[, data] ) -> Boolean
	 *	- message (String): The message to publish
	 *	- data: The data to pass to subscribers
	 *	- sync (Boolean): Forces publication to be syncronous, which is more confusing, but faster
	 *	Publishes the the message synchronously, passing the data to it's subscribers
	**/
	PubSub.publishSync = function( message, data ){
		return publish( message, data, true );
	};

	/**
	 *	PubSub.subscribe( message, func ) -> String
	 *	- message (String): The message to subscribe to
	 *	- func (Function): The function to call when a new message is published
	 *	Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
	**/
	PubSub.subscribe = function( message, func ){
		// message is not registered yet
		if ( !messages.hasOwnProperty( message ) ){
			messages[message] = [];
		}

		// forcing token as String, to allow for future expansions without breaking usage
		// and allow for easy use as key names for the 'messages' object
		var token = (++lastUid).toString();
		messages[message].push( { token : token, func : func } );

		// return token for unsubscribing
		return token;
	};

	/**
	 *	PubSub.unsubscribe( token ) -> String | Boolean
	 *	- token (String): The token of the function to unsubscribe
	 *	Unsubscribes a specific subscriber from a specific message using the unique token
	**/
	PubSub.unsubscribe = function( token ){
		var m, i, j;
		for ( m in messages ){
			if ( messages.hasOwnProperty( m ) ){
				for ( i = 0, j = messages[m].length; i < j; i++ ){
					if ( messages[m][i].token === token ){
						messages[m].splice( i, 1 );
						return token;
					}
				}
			}
		}
		return false;
	};
	
	// AMD define happens at the end for compatibility with AMD loaders
	// that don't enforce next-turn semantics on modules.
	if (typeof define === 'function' && define.amd) {
		define('pubsub', function(){
			return PubSub;
		});
	}

}(this));