/*jslint white:true*/
/*global
	PubSub,
	buster,
	define,
	sinon
*/
define([
	'../../node_modules/jquery/dist/jquery',
	'../../jquery.pubsub',
	'../helper'
], function(
	jquery,
	pubsub,
	helper
){

	'use strict';

	helper.verifyPubSubAPI(pubsub);
});
