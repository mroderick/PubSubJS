'use strict';

var PubSub = require('../src/pubsub'),
    TestHelper = require('./helper'),
    assert = require('referee').assert,
    sinon = require('sinon');

describe('test-countSubscriptions method', function () {
    it('must be count eq 0', function () {
        var topic = TestHelper.getUniqueString(),
            spy1 = sinon.spy();

        PubSub.subscribe(topic, spy1);

        var counts = PubSub.countSubscriptions(topic);

        assert.equals(counts,1);
    });

    it('should count all subscriptions', function() {
        var topic = TestHelper.getUniqueString(),
            spy1 = sinon.spy(),
            spy2 = sinon.spy();

        PubSub.subscribe(topic, spy1);
        PubSub.subscribe(topic, spy2);

        var counts = PubSub.countSubscriptions(topic);

        assert.equals(counts, 2);
    });
});
