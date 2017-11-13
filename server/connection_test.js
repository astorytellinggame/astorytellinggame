const Connection = require('./connection');
const WebSocket = require('ws');
const { spy } = require('sinon');

test('constructor sends welcome', () => {
  const mockSend = spy();
  new Connection({ send: mockSend });
  expect(mockSend.callCount).toBe(1);
  expect(mockSend.getCall(0).args[0]).toBe('{"topic":"welcome","message":{}}');
});
