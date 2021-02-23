'use strict';

var PubSub = require('../src/pubsub'),
    TestHelper = require('./helper'),
    assert = require('referee').assert,
    sinon = require('sinon');

describe('getSubscriptions method', function () {
    it('must be length eq 0', function () {
        var topic = TestHelper.getUniqueString(),
            spy1 = sinon.spy();

        PubSub.subscribe(topic, spy1);

        var subscriptions = PubSub.getSubscriptions(topic).length;

        assert.equals(subscriptions,1);
    });

    it('should return all subscriptions', function() {
        var topic = TestHelper.getUniqueString(),
            spy1 = sinon.spy(),
            spy2 = sinon.spy();

        PubSub.subscribe(topic, spy1);
        PubSub.subscribe(topic, spy2);

        var subscriptions = PubSub.getSubscriptions(topic);
        assert.equals(subscriptions[0], spy1);
        assert.equals(subscriptions[1], spy2);
    });

});
