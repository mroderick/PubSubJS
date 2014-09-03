/*jslint white:true*/
/*global
	define,
	buster,
	console,
	jQuery
*/
define([
	// '../../node_modules/jquery/dist/jquery',
	'../../jquery.pubsub',
	'../helper'
], function(
	// $,
	pubsub,
	TestHelper
){

	'use strict';

	var assert = buster.assert;

	TestHelper.verifyPubSubAPI(pubsub);

	buster.testCase('Verify jQuery API', {
		'should add the "pubsub" method to jQuery': function(){
			assert.isFunction(jQuery.pubsub);
		}
	});
});
