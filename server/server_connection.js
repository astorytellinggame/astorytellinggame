const Connection = require('../lib/connection');
const Player = require('./player');

/**
 * The ServerConnection class that is created and associated with every
 * incoming WebSocket connection. Responsible for performing the auth handshake
 * with the client and creating a Player object or restoring connection to an
 * existing Player object.
 */
class ServerConnection {
  /**
   * @param {!WebSocket} ws
   */
  constructor(ws) {
    this.connection_ = new Connection(ws);

    this.connection_.notify('welcome', {});
    this.connection_.waitForTopic('auth').then(data => this.handleAuth_(data));
  }

  handleAuth_(data) {
    if (typeof data.name != 'string' || data.name.length == 0) {
      this.connection_.waitForTopic('auth', this.handleAuth_.bind(this));
      debug('handleAuth_ did not receive a name. Waiting again.');
      return;
    }
    const p = new Player(this.connection_, data.name);
    this.connection_.notify('playerCreated', {});
  }
}

module.exports = ServerConnection;
