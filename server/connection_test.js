const Connection = require('./connection');
const WebSocket = require('ws');
const assert = require('assert');
const { spy } = require('sinon');

describe('Connection', () => {
  it('Should send a welcome message', () => {
    const mockSend = spy();
    new Connection({ send: mockSend });
    assert.equal(1, mockSend.callCount);
    assert.equal(
      '{"topic":"welcome","message":{}}', mockSend.getCall(0).args[0]);
  });
});
