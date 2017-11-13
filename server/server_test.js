const Connection = require('./connection');
const Server = require('./server');
const WebSocket = require('ws');
const assert = require('assert');
const http = require('http');

describe('Server', () => {
  let selfTidyingServer; // to force cleanup

  afterEach(() => {
    selfTidyingServer && selfTidyingServer.stop();
    selfTidyingServer = null;
  });

  /**
   * Verifies that an HTTP server is responding on the specified port.
   * @param {number} port
   * @param {number} path
   * @param {number} expectedStatusCode
   * @return {!Promise} Resolves after verifying HTTP response code 200.
   */
  const verifyHttpResponse = (port, path = '/', expectedStatusCode = 200) => {
    return new Promise((resolve) => {
      http.get(`http://localhost:${port}${path}`, (res) => {
        const { statusCode } = res;
        assert.equal(expectedStatusCode, statusCode);
        resolve();
      });
    });
  };

  describe('custom configuration', () => {
    it('Should serve traffic on an overridden port', (done) => {
      selfTidyingServer = new Server(3001);
      selfTidyingServer.start();
      verifyHttpResponse(3001).then(() => {
        http.get('http://localhost:3000/', (res) => {
          assert.fail('Did not expect a server to respond on :3000.');
        }).on('error', (e) => {
          assert.equal('ECONNREFUSED', e.code);
          done();
        });
      });
    });
  });

  describe('default configuration', () => {
    beforeEach(() => {
      selfTidyingServer = new Server();
      selfTidyingServer.start();
    });

    it('Should serve traffic on :3000 by default', (done) => {
      verifyHttpResponse(3000).then(done);
    });

    it('Should serve basic assets', (done) => {
      // Don't test bundle.js since it's generated by webpack.
      verifyHttpResponse(3000, '/favicon.ico', 200).then(() => {
        return verifyHttpResponse(3000, '/unknownpath', 404);
      }).then(done);
    });

    it('Should respond to websockets connections on the server port', (done) => {
      const ws = new WebSocket('ws://localhost:3000/');
      ws.on('open', () => {
        ws.close();
        done();
      });
    });

    // TODO: Add test for ws connections building a new Connection.
  });
});
