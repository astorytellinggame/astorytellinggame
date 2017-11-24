class Player {
  /**
   * @param {!Connection} connection
   * @param {string} name
   * @constructor
   */
  constructor(connection, name) {
    /**
     * @private {!Connection}
     */
    this.connection_ = connection;

    /**
     * @private @const {string}
     */
    this.name = name;
  }

  /**
   * Detaches the existing connection and attaches a new one.
   * @param {!Connection} connection
   */
  attachConnection(connection) {
    this.connection_.detach();
    this.connection_ = connection;
  }

  /**
   * @param {!Player} joiningPlayer
   */
  notifyPlayerJoined(joiningPlayer) {
    this.connection_.notify('playerJoined', { name: joiningPlayer.name });
  }
}

module.exports = Player;
