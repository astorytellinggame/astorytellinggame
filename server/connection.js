class Connection {
  /**
   * @param {!WebSocket} ws
   */
  constructor(ws) {
    this.ws = ws;
    this.notify('welcome', {});
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
