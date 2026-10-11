'use strict';

var PubSub = require('../src/pubsub'),
    TestHelper = require('./helper'),
    assert = require('referee').assert,
    refute = require('referee').refute,
    sinon = require('sinon');

describe('clearAllSubscriptions method', function () {
    it('must clear all subscriptions', function () {
        var topic = TestHelper.getUniqueString(),
            spy1 = sinon.spy(),
            spy2 = sinon.spy();

        PubSub.subscribe(topic, spy1);
        PubSub.subscribe(topic, spy2);

        PubSub.clearAllSubscriptions();

        PubSub.publishSync(topic, TestHelper.getUniqueString());

        refute(spy1.called);
        refute(spy2.called);
    });
});

['clearSubscriptions', 'unsubscribe'].forEach(function(method) {
    describe(method + ' topic boundaries', function() {
        it('clears the topic and descendants while retaining a shared string prefix', function() {
            var topic = TestHelper.getUniqueString(),
                parent = sinon.spy(),
                child = sinon.spy(),
                unrelated = sinon.spy();

            PubSub.subscribe(topic, parent);
            PubSub.subscribe(topic + '.child', child);
            PubSub.subscribe(topic + 'ing', unrelated);

            PubSub[method](topic);

            PubSub.publishSync(topic, 'parent');
            PubSub.publishSync(topic + '.child', 'child');
            PubSub.publishSync(topic + 'ing', 'unrelated');

            refute(parent.called);
            refute(child.called);
            assert(unrelated.calledOnce);
        });

        it('retains a shared prefix when only descendants of the requested topic exist', function() {
            var topic = TestHelper.getUniqueString(),
                child = sinon.spy(),
                unrelated = sinon.spy();

            PubSub.subscribe(topic + '.child', child);
            PubSub.subscribe(topic + 'ing', unrelated);

            PubSub[method](topic);

            PubSub.publishSync(topic + '.child', 'child');
            PubSub.publishSync(topic + 'ing', 'unrelated');

            refute(child.called);
            assert(unrelated.calledOnce);
        });
    });
});
