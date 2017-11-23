class Game {
  constructor() {
    this.players = new Set;
  }

  addPlayer(joiningPlayer) {
    this.players.add(joiningPlayer);
    this.players.forEach((player) => {
      player.notifyPlayerJoined(joiningPlayer);
    });
  }
}

module.exports = Game;
