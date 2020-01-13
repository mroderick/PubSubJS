'use strict';

var PubSub = require('../src/pubsub'),
    TestHelper = require('./helper'),
    refute = require('referee').refute,
    assert = require('referee').assert,

    sinon = require('sinon');

describe('try wildcard method', function () {

    it('should return true, if using * char in messages', function () {
        var topic = 'pubsub.*.wildcard',
            spy1 = sinon.spy();
            

        PubSub.subscribe(topic, spy1);

        PubSub.clearAllSubscriptions();

        PubSub.publishSync('pubsub.anythingelse.wildcard', TestHelper.getUniqueString());

        refute(spy1.called);
    });

    it('should return true, not matching in messages', function () {
        var topic = 'pubsub.test.*.wildcard',
            spy1 = sinon.spy();

        PubSub.subscribe(topic, spy1);
        PubSub.clearAllSubscriptions();
        PubSub.publishSync('pubsub.anythingelse.wildcard', TestHelper.getUniqueString());
        assert(spy1.notCalled);
    });
});
