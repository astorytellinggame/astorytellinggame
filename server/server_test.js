jest.mock('./connection');
const MockConnection = require('./connection');
jest.mock('./lobby');
const MockLobby = require('./lobby');

const Server = require('./server');
const WebSocket = require('ws');
const http = require('http');
const { fail } = require('assert');

let selfTidyingServer; // to force cleanup

beforeEach(() => {
  MockLobby.mockClear();
});

afterEach(() => {
  selfTidyingServer && selfTidyingServer.stop();
  selfTidyingServer = null;
});

test('custom port configuration', done => {
  selfTidyingServer = new Server(3001);
  selfTidyingServer
    .start()
    .then(() => verifyHttpResponse(3001))
    .then(() => {
      http
        .get('http://localhost:3000/', res => {
          fail('Did not expect a server to respond on :3000.');
        })
        .on('error', e => {
          expect(e.code).toBe('ECONNREFUSED');
          done();
        });
    });
});

describe('default port configuration', () => {
  beforeEach(() => {
    selfTidyingServer = new Server();
    return selfTidyingServer.start();
  });

  test('serves basic traffic', () => {
    return verifyHttpResponse(3000);
  });

  test('serves static assets and 404s', () => {
    // Don't test bundle.js since it's generated by webpack.
    return verifyHttpResponse(3000, '/favicon.ico', 200).then(() => {
      return verifyHttpResponse(3000, '/unknownpath', 404);
    });
  });

  test('basic webserver connection', done => {
    const ws = new WebSocket('ws://localhost:3000/');
    ws.on('open', () => {
      ws.close();
      done();
    });
  });

  test('creates basic lobby', () => {
    expect(MockLobby.mock.instances).toHaveLength(1);
  });
});

describe('websockets connection handling', () => {
  let connectionMadeWithWs;

  beforeEach(() => {
    connectionMadeWithWs = undefined;
    MockConnection.mockImplementation(ws => {
      connectionMadeWithWs = ws;
    });
    selfTidyingServer = new Server();
    return selfTidyingServer.start();
  });

  afterEach(() => {
    MockConnection.mockRestore();
  });

  test('connection initialized', done => {
    expect(connectionMadeWithWs).not.toBeDefined();
    const ws = new WebSocket('ws://localhost:3000/');
    ws.on('open', () => {
      expect(connectionMadeWithWs).toBeDefined();
      ws.close();
      done();
    });
  });
});

/**
 * Verifies that an HTTP server is responding on the specified port.
 * @param {number} port
 * @param {number} path
 * @param {number} expectedStatusCode
 * @return {!Promise} Resolves after verifying HTTP response code 200.
 */
const verifyHttpResponse = (port, path = '/', expectedStatusCode = 200) => {
  return new Promise(resolve => {
    http.get(`http://localhost:${port}${path}`, res => {
      const { statusCode } = res;
      expect(statusCode).toBe(expectedStatusCode);
      resolve();
    });
  });
};
