/*jslint white:true, plusplus:true, stupid:true*/
/*global
	exports,
	module,
    buster,
	define,
	window
*/
(function(root, factory){
	'use strict';

	// CommonJS
	if (typeof exports === 'object'){
		module.exports = factory();

	// AMD
	} else if (typeof define === 'function' && define.amd){
		define(factory);
	// Browser
	} else {
		root.TestHelper = factory();
	}
}( ( typeof window === 'object' && window ) || this, function(){

	'use strict';

	var assert = buster.assert;

	// helps us make sure that the order of the tests have no impact on their succes
	function getUniqueString(){
		if ( getUniqueString.uid === undefined ){
			getUniqueString.uid = 0;
		}
		getUniqueString.uid++;

		return "my unique String number " + getUniqueString.uid.toString();
	}

	// makes sure that all tokens in the passed array are different
	function assertAllTokensDifferent( tokens ){
		var length = tokens.length,
			j, k;
		assert( tokens.length > 0 );
		// compare all tokens
		for ( j = 0; j < length; j++ ){
			for ( k = j + 1; k < length; k++ ){
				assert( tokens[j] !== tokens[k] );
			}
		}

		// make sure we actually tested something
		assert.equals( j, length );
		assert.equals( k, length );
	}

	function verifyPubSubAPI(api){
		var assert = buster.assert,
			refute = buster.refute;

		// This test case is not about testing individual methods, but only here
		// to verify that the API is correctly assembled when loaded with in different
		// contexts (Node, AMD, jQuery)
		buster.testCase('PubSub API for AMD compatibility', {
			'should have a "subscribe" method': function() {
				assert.isFunction(api.subscribe);
			},

			'should have an "unsubscribe" method': function(){
				assert.isFunction(api.unsubscribe);
			},

			'should have a "publish" method': function(){
				assert.isFunction(api.publish);
			},

			'should have a "publisSync" method': function(){
				assert.isFunction(api.publishSync);
			},

			'should have a "clearAllSubscriptions" method': function(){
				assert.isFunction(api.clearAllSubscriptions);
			}
		});
	}

	return {
		assertAllTokensDifferent : assertAllTokensDifferent,
		getUniqueString : getUniqueString,
		verifyPubSubAPI : verifyPubSubAPI
	};
}));
