jest.mock('../lib/connection');
const MockConnection = require('../lib/connection');

const Player = require('./player');

test('constructor works', () => {
  const c = new MockConnection();
  const p = new Player(c, 'Bob');
  expect(c.sentNotifications).toHaveLength(0);
});

test('attachConnection', () => {
  const c1 = new MockConnection();
  const c2 = new MockConnection();
  const c3 = new MockConnection();
  const p = new Player(c1, 'Bob');
  expect(c1.detached).toBe(false);
  expect(c2.detached).toBe(false);

  p.attachConnection(c2);
  expect(c1.detached).toBe(true);
  expect(c2.detached).toBe(false);

  p.attachConnection(c3);
  expect(c1.detached).toBe(true);
  expect(c2.detached).toBe(true);
  expect(c3.detached).toBe(false);
});

test('notifyPlayerJoined', () => {
  const c = new MockConnection();
  const p = new Player(c, 'Bob');
  expect(c.sentNotifications).toHaveLength(0);

  p.notifyPlayerJoined(new Player(new MockConnection(), 'Charlie'));
  expect(c.sentNotifications).toHaveLength(1);
  expect(c.sentNotifications[0].topic).toBe('playerJoined');
  expect(c.sentNotifications[0].data).toEqual({ name: 'Charlie' });
});
