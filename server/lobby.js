const Game = require('./game');

/**
 * A list of games available to join.
 */
class Lobby {
  constructor() {
    /**
     * @private {!Array{!Game}}
     */
    this.games_ = [];
    this.games_.push(new Game());
  }

  listGames() {
    return this.games_;
  }
}

module.exports = Lobby;
