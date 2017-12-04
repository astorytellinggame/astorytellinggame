class MockConnection {
  constructor(ws) {
    MockConnection.instances.push(this);

    /** @private {boolean} */
    this.detached = false;

    /**
     * @private @const {!Array<!TopicAndData>}
     */
    this.sentNotifications = [];

    /**
     * A map of topics to resolver functions to call with the data when a
     * message of the matching topic is received.
     * @private @const {!Map<string,!Array<!Function<!Object>>>}
     */
    this.waitedTopics_ = new Map();
  }

  detach() {
    this.detached = true;
  }

  /**
   * @param {string} topic
   * @param {!Object} data
   */
  notify(topic, data) {
    this.sentNotifications.push({topic, data});
  }

  /**
   * Pretend a client just sent the matching message.
   * @param {string} topic
   * @param {!Object} data
   */
  fakeClientMessage(topic, data) {
    const subscribers = this.waitedTopics_.get(topic);
    if (subscribers) {
      subscribers.forEach(subscriber => subscriber(data));
      this.waitedTopics_.set(topic, []);
    }
    return Promise.resolve();
  }

  /**
   * Returns a Promise that resolves to the message data when the next message
   * matching this topic is received.
   * @param {string} topic
   * @return {!Promise<!Object>}
   */
  waitForTopic(topic) {
    let subscribers = this.waitedTopics_.get(topic);
    if (!subscribers) {
      subscribers = [];
      this.waitedTopics_.set(topic, subscribers);
    }
    return new Promise(resolve => {
      subscribers.push(resolve);
    });
  }
}

MockConnection.instances = [];
MockConnection.reset = function() {
  MockConnection.instances = [];
};

/**
 * @typedef {Object} TopicAndData
 * @property {!string} topic
 * @property {!Object} data
 */

module.exports = MockConnection;
