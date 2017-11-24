jest.mock('./lobby');
const MockLobby = require('./lobby');
jest.mock('./player');
const MockPlayer = require('./player');

const Connection = require('./connection');
const assert = require('assert');

describe('with single mock ws', () => {
  const lobby = new MockLobby();
  let ws;

  beforeEach(() => {
    ws = { close: jest.fn(), on: jest.fn(), send: jest.fn() };
  });

  test('constructor sends welcome', () => {
    new Connection(ws, lobby);
    expect(ws.send.mock.calls).toHaveLength(1);
    expect(ws.send.mock.calls[0][0]).toBe('{"topic":"welcome","data":{}}');
  });

  test('detach', () => {
    const c = new Connection(ws, lobby);
    c.detach();
    expect(ws.close.mock.calls).toHaveLength(1);
  });

  describe('waitForTopic', () => {
    let c;
    let pretendMessageReceived;

    beforeEach(() => {
      c = new Connection(ws, lobby);
      expect(ws.on.mock.calls).toHaveLength(1);
      pretendMessageReceived = messageStr => {
        ws.on.mock.calls[0][1](messageStr);
        return Promise.resolve();
      };
    });

    test('basic wait', done => {
      c.waitForTopic('foo').then(done);
      pretendMessageReceived('{"topic":"foo"}');
    });

    test('ignores unrelated messages', done => {
      c
        .waitForTopic('foo')
        .then(() => assert.fail('Should not receive unrelated message.'));
      c.waitForTopic('bar').then(done);
      pretendMessageReceived('{"topic":"bar"}');
    });

    test('multiple subscribers', async () => {
      let count = 0;
      c.waitForTopic('foo').then(() => count++);
      c.waitForTopic('foo').then(() => count++);
      c.waitForTopic('foo').then(() => count++);
      c.waitForTopic('barbarbar').then(() => count++);
      c.waitForTopic('foo').then(() => count++);
      await pretendMessageReceived('{"topic":"foo"}');
      expect(count).toEqual(4);
    });

    test('subscribe only once', async () => {
      let count = 0;
      c.waitForTopic('foo').then(() => count++);
      c.waitForTopic('bar').then(() => count++);
      await pretendMessageReceived('{"topic":"foo"}');
      expect(count).toEqual(1);
      await pretendMessageReceived('{"topic":"foo"}');
      expect(count).toEqual(1);
      await pretendMessageReceived('{"topic":"bar"}');
      expect(count).toEqual(2);
      await pretendMessageReceived('{"topic":"bar"}');
      expect(count).toEqual(2);
    });
  });

  test('notify', () => {
    const c = new Connection(ws, lobby);
    c.notify('foo', { bar: 'baz' });
    expect(ws.send.mock.calls).toHaveLength(2);
    expect(ws.send.mock.calls[1][0]).toBe(
      '{"topic":"foo","data":{"bar":"baz"}}'
    );
  });

  describe('handleAuth_', () => {
    let c;
    let pretendMessageReceived;

    beforeEach(() => {
      MockPlayer.mockClear();
      c = new Connection(ws, lobby);
      expect(ws.on.mock.calls).toHaveLength(1);
      pretendMessageReceived = messageStr => {
        ws.on.mock.calls[0][1](messageStr);
        return Promise.resolve();
      };
    });

    it('works', async () => {
      expect(MockPlayer.mock.instances).toHaveLength(0);
      await pretendMessageReceived('{"topic":"auth","data":{"name":"Alice"}}');
      expect(MockPlayer.mock.instances).toHaveLength(1);
    });

    it('ignores subsequent auth messages', async () => {
      expect(MockPlayer.mock.instances).toHaveLength(0);
      await pretendMessageReceived('{"topic":"auth","data":{"name":"Alice"}}');
      await pretendMessageReceived('{"topic":"auth","data":{"name":"Bob"}}');
      expect(MockPlayer.mock.instances).toHaveLength(1);
      expect(MockPlayer.mock.calls[0][1]).toEqual('Alice');
    });
  });
});
