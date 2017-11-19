/**
 * The Connection class that is created and associated with every incoming
 * WebSocket connection. Responsible for performing the auth handshake with the
 * client and creating a Player object or restoring connection to an existing
 * Player object.
 */
class Connection {
  /**
   * @param {!WebSocket} ws
   */
  constructor(ws) {
    this.ws = ws;
    this.notify('welcome', {});
  }

  /**
   * Closes the WebSocket.
   */
  detach() {
    this.ws.close();
  }

  /**
   * @param {string} topic
   * @param {!Object} message
   */
  notify(topic, message) {
    this.ws.send(JSON.stringify({ topic, message }));
  }
}

module.exports = Connection;
