jest.mock('../lib/connection');
const MockConnection = require('../lib/connection');
jest.mock('./player');
const MockPlayer = require('./player');
const ServerConnection = require('./server_connection');

describe(ServerConnection, () => {
  let conn;
  let serverConnection;

  beforeEach(() => {
    MockConnection.reset();
    serverConnection = new ServerConnection({});
    expect(MockConnection.instances).toHaveLength(1);
    conn = MockConnection.instances[0];
  });

  test('constructor sends welcome', () => {
    expect(conn.sentNotifications).toHaveLength(1);
    expect(conn.sentNotifications[0].topic).toBe('welcome');
  });

  describe('handleAuth_', () => {
    beforeEach(() => {
      MockPlayer.mockClear();
    });

    it('works', async () => {
      expect(MockPlayer.mock.instances).toHaveLength(0);
      conn.sentNotifications = [];
      await conn.fakeClientMessage('auth', { name: 'Alice' });
      expect(MockPlayer.mock.instances).toHaveLength(1);
      expect(conn.sentNotifications).toHaveLength(1);
      expect(conn.sentNotifications[0].topic).toBe('playerCreated');
    });

    it('ignores subsequent auth messages', async () => {
      expect(MockPlayer.mock.instances).toHaveLength(0);
      await conn.fakeClientMessage('auth', { name: 'Alice' });
      await conn.fakeClientMessage('auth', { name: 'Bob' });
      expect(MockPlayer.mock.instances).toHaveLength(1);
      expect(MockPlayer.mock.calls[0][1]).toEqual('Alice');
    });
  });
});
