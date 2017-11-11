const Server = require('./server');

const assert = require('assert');
const http = require('http');

describe('Server', () => {
  let selfTidyingServer; // to force cleanup

  afterEach(() => {
    selfTidyingServer && selfTidyingServer.stop();
    selfTidyingServer = null;
  });

  const verifyListeningOn = (port) => {
    return new Promise((resolve) => {
      http.get(`http://localhost:${port}/`, (res) => {
        const { statusCode } = res;
        assert.equal(200, statusCode);
        resolve();
      });
    });
  };

  it('Should serve traffic on :3000 by default', (done) => {
    selfTidyingServer = new Server();
    selfTidyingServer.start();
    verifyListeningOn(3000).then(done);
  });

  it('Should serve traffic on an overridden port', (done) => {
    selfTidyingServer = new Server(3001);
    selfTidyingServer.start();
    verifyListeningOn(3001).then(() => {
      http.get('http://localhost:3000/', (res) => {
        assert.fail('Did not expect a server to respond on :3000.');
      }).on('error', (e) => {
        assert.equal('ECONNREFUSED', e.code);
        done();
      });
    });
  });
});
