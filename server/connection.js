const Player = require('./player');
const { debug } = require('./log');

/**
 * The Connection class that is created and associated with every incoming
 * WebSocket connection. Responsible for performing the auth handshake with the
 * client and creating a Player object or restoring connection to an existing
 * Player object.
 */
class Connection {
  /**
   * @param {!WebSocket} ws
   * @param {!Lobby} lobby
   */
  constructor(ws, lobby) {
    this.ws_ = ws;

    this.lobby_ = lobby;

    /**
     * A map of topics to resolver functions to call with the data when a
     * message of the matching topic is received.
     * @private @const {!Map<string,!Array<!Function<!Object>>>}
     */
    this.waitedTopics_ = new Map();

    this.ws_.on('message', this.handleMessage_.bind(this));

    this.notify('welcome', {});
    this.waitForTopic('auth').then(data => this.handleAuth_(data));
  }

  /**
   * Closes the WebSocket.
   */
  detach() {
    this.ws_.close();
  }

  /**
   * @param {string} topic
   * @param {!Object} data
   */
  notify(topic, data) {
    this.ws_.send(JSON.stringify({ topic, data }));
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

  handleAuth_(data) {
    if (typeof data.name != 'string' || data.name.length == 0) {
      this.waitForTopic('auth', this.handleAuth_.bind(this));
      debug('handleAuth_ did not receive a name. Waiting again.');
      return;
    }
    const p = new Player(this, data.name);
    this.notify('playerCreated', {});
  }

  /**
   * Handles a WebSockets message. Parses the message and dispatches it to
   * relevant subscribers.
   */
  handleMessage_(messageStr) {
    let message;
    try {
      message = JSON.parse(messageStr);
    } catch (e) {
      if (e instanceof SyntaxError) {
        console.log(`Failed to parse message: ${messageStr}`);
        return;
      }
      throw e;
    }
    const subscribers = this.waitedTopics_.get(message.topic);
    if (subscribers) {
      subscribers.forEach(subscriber => subscriber(message.data));
      this.waitedTopics_.set(message.topic, []);
    }
  }
}

module.exports = Connection;
