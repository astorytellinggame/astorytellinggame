class Game {
  constructor() {
    /**
     * @private {!Array<!Player>}
     */
    this.players_ = new Set();
  }

  addPlayer(joiningPlayer) {
    this.players_.add(joiningPlayer);
    this.players_.forEach(player => {
      player.notifyPlayerJoined(joiningPlayer);
    });
  }
}

module.exports = Game;
