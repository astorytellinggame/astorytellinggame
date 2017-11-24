jest.mock('./lobby');
const MockLobby = require('./lobby');
jest.mock('./player');
const MockPlayer = require('./player');

const Connection = require('./connection');

describe('with single mock ws', () => {
  const lobby = new MockLobby();
  let ws;

  beforeEach(() => {
    ws = { close: jest.fn(), send: jest.fn() };
  });

  test('constructor sends welcome', () => {
    new Connection(ws, lobby);
    expect(ws.send.mock.calls).toHaveLength(1);
    expect(ws.send.mock.calls[0][0]).toBe('{"topic":"welcome","message":{}}');
  });

  test('detach', () => {
    const c = new Connection(ws, lobby);
    c.detach();
    expect(ws.close.mock.calls).toHaveLength(1);
  });

  test('notify', () => {
    const c = new Connection(ws, lobby);
    c.notify('foo', {'bar': 'baz'});
    expect(ws.send.mock.calls).toHaveLength(2);
    expect(ws.send.mock.calls[1][0])
      .toBe('{"topic":"foo","message":{"bar":"baz"}}');
  });
});
