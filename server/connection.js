const Player = require('./player');

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
    this.notify('welcome', {});

    // Create a new player on connect for now. TODO: Add auth to reconnect to
    // existing player.
    new Player();
  }

  /**
   * Closes the WebSocket.
   */
  detach() {
    this.ws_.close();
  }

  /**
   * @param {string} topic
   * @param {!Object} message
   */
  notify(topic, message) {
    this.ws_.send(JSON.stringify({ topic, message }));
  }
}

module.exports = Connection;
