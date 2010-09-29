/*
Copyright (c) 2010 Morgan Roderick http://roderick.dk

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/*jslint evil: false, strict: false, undef: true, white: false, onevar:false, plusplus:false */
/*global setTimeout:true */
/** section: PubSub
 *  PubSubJS is a dependency free library for doing ['publish/subscribe'](http://en.wikipedia.org/wiki/Publish/subscribe)
 *  messaging in JavaScript.
 *  
 *  In order to not have surprising behaviour where the execution chain generates more than one message, 
 *  publication of messages with PubSub are done asyncronously (this also helps keep your code responsive, by 
 *  dividing work into smaller chunkcs, allowing the event loop to do it's business).
 * 
 *  ##### Examples
 *  
 *      // create a function to receive the message
 *      var mySubscriber = function( msg, data ){
 *          console.log( msg, data );
 *      };
 * 
 *      // add the function to the list of subscribers to a particular message
 *      // we're keeping the returned token, in order to be able to unsubscribe from the message later on
 *      var token = PubSub.subscribe( 'MY MESSAGE', mySubscriber );
 *
 *      // publish a message asyncronously
 *      PubSub.publish( 'MY MESSAGE', 'hello world!' );
 *      
 *      // unsubscribe from further messages, using setTimeout to allow for easy pasting of this code into an example :-)
 *      setTimeout(function(){
 *          PubSub.unsubscribe( token );
 *      }, 0)
**/ 
var PubSub = {};
(function(p){
    "use strict";
    
    var messages = {};
    var lastUid = -1;

    /**
     *  PubSub.publish( message[, data] ) -> Boolean
     *  - message (String): The message to publish
     *  - data: The data to pass to subscribers
     *  Publishes the the passed message, passing the data to it's subscribers
    **/
    p.publish = function( message, data ){
        if ( !messages.hasOwnProperty( message ) ){
            return false;
        }
        // create a timeout to force message processing to be async
        setTimeout( function(){
            for ( var i = 0, j = messages[message].length; i < j; i++ ){
                messages[message][i].func( message, data );
            }
        }, 0);
        
        return true;
    };

    /**
     *  PubSub.subscribe( message, func ) -> String
     *  - message (String): The message to subscribe to
     *  - func (Function): The function to call when a new message is published
     *  Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
    **/
    p.subscribe = function( message, func ){
        // message is not registered yet
        if ( !messages.hasOwnProperty( message ) ){
            messages[message] = [];
        }
        
        var token = (++lastUid).toString();
        messages[message].push( { token : token, func : func } );
        
        // return token for unsubscribing
        return token;
    };

    /**
     *  PubSub.unsubscribe( token ) -> String | Boolean
     *  - token (String): The token of the function to unsubscribe
     *  Unsubscribes a specific subscriber from a specific message using the unique token
    **/
    p.unsubscribe = function( token ){
        for ( var m in messages ){
            if ( messages.hasOwnProperty( m ) ){
                for ( var i = 0, j = messages[m].length; i < j; i++ ){
                    if ( messages[m][i].token === token ){
                        messages[m].splice( i, 1 );
                        return token;
                    }
                }
            }
        }
        return false;
    };

}(PubSub));