/*jslint white:true*/
/*global
	PubSub,
	buster,
	define,
	sinon
*/
define(['../../src/pubsub', '../helper'], function(pubsub, helper){

	'use strict';

	helper.verifyPubSubAPI(pubsub);
});
