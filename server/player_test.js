jest.mock('./connection');
const MockConnection = require('./connection');

const Player = require('./player');

test('constructor works', () => {
  const c = new MockConnection();
  const p = new Player('c', 'Bob');
  expect(c.notify.mock.calls).toHaveLength(0);
});

test('attachConnection', () => {
  const c1 = new MockConnection();
  const c2 = new MockConnection();
  const c3 = new MockConnection();
  const p = new Player(c1, 'Bob');
  expect(c1.detach.mock.calls).toHaveLength(0);
  expect(c2.detach.mock.calls).toHaveLength(0);

  p.attachConnection(c2);
  expect(c1.detach.mock.calls).toHaveLength(1);
  expect(c2.detach.mock.calls).toHaveLength(0);

  p.attachConnection(c3);
  expect(c1.detach.mock.calls).toHaveLength(1);
  expect(c2.detach.mock.calls).toHaveLength(1);
  expect(c3.detach.mock.calls).toHaveLength(0);
});

test('notifyPlayerJoined', () => {
  const c = new MockConnection();
  const p = new Player(c, 'Bob');
  expect(c.notify.mock.calls).toHaveLength(0);

  p.notifyPlayerJoined(new Player(new MockConnection(), 'Charlie'));
  expect(c.notify.mock.calls).toHaveLength(1);
  expect(c.notify.mock.calls[0][0]).toBe('playerJoined');
  expect(c.notify.mock.calls[0][1]).toEqual({ 'name': 'Charlie' });
});
