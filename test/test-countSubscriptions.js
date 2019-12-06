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
});
