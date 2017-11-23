const Lobby = require('./lobby');

test('listGames', () => {
  expect(new Lobby().listGames()).toHaveLength(1);
});
