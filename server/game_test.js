jest.mock('./player');
const MockPlayer = require('./player');

const Game = require('./game');

test('constructor', () => {
  new Game();
});

test('addPlayer', () => {
  const g = new Game();
  const p1 = new MockPlayer();
  const p2 = new MockPlayer();

  g.addPlayer(p1);
  expect(p1.notifyPlayerJoined.mock.calls).toHaveLength(1);
  expect(p2.notifyPlayerJoined.mock.calls).toHaveLength(0);
  g.addPlayer(p2);
  expect(p1.notifyPlayerJoined.mock.calls).toHaveLength(2);
  expect(p2.notifyPlayerJoined.mock.calls).toHaveLength(1);
});
