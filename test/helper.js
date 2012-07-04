/*global
	exports,
	module,
	assert,
	define
*/
(function(root){
	"use strict";

	var TestHelper = {};

	// Export the PubSub object for **Node.js** and **"CommonJS"**, with
	// backwards-compatibility for the old `require()` API. If we're not in
	// CommonJS, add `PubSub` to the global object via a string identifier for
	// the Closure Compiler "advanced" mode. Registration as an AMD module
	// via define() happens at the end of this file.
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = TestHelper;
		}
		exports.PubSub = TestHelper;
	} else {
		root.TestHelper = TestHelper;
	}


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

	TestHelper.getUniqueString = getUniqueString;
	TestHelper.assertAllTokensDifferent = assertAllTokensDifferent;
	
	// AMD define happens at the end for compatibility with AMD loaders
	// that don't enforce next-turn semantics on modules.
	if (typeof define === 'function' && define.amd) {
		define(function(){
			return TestHelper;
		});
	}

}(this));