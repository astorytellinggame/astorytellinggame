const Connection = require('./connection');

describe('with single mock ws', () => {
  let ws;

  beforeEach(() => {
    ws = { close: jest.fn(), send: jest.fn() };
  });

  test('constructor sends welcome', () => {
    new Connection(ws);
    expect(ws.send.mock.calls).toHaveLength(1);
    expect(ws.send.mock.calls[0][0]).toBe('{"topic":"welcome","message":{}}');
  });

  test('detach', () => {
    const c = new Connection(ws);
    c.detach();
    expect(ws.close.mock.calls).toHaveLength(1);
  });

  test('notify', () => {
    const c = new Connection(ws);
    c.notify('foo', {'bar': 'baz'});
    expect(ws.send.mock.calls).toHaveLength(2);
    expect(ws.send.mock.calls[1][0])
      .toBe('{"topic":"foo","message":{"bar":"baz"}}');
  });
});
