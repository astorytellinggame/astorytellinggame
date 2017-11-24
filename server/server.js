const Connection = require('./connection');
const Hapi = require('hapi');
const Lobby = require('./lobby');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const inert = require('inert');

class Server {
  /**
   * @param {number} port
   * @constructor
   */
  constructor(port = 3000) {
    this.port = port;
  }

  /**
   * Starts the server.
   */
  async start() {
    this.server_ = new Hapi.Server({ port: this.port });
    this.lobby_ = new Lobby();
    const wss = new WebSocket.Server({ server: this.server_.listener });
    wss.on('connection', this.handleWebSocketsConnection_.bind(this));
    await this.server_.register({ plugin: inert });
    this.server_.route({
      method: 'GET',
      path: '/{filename?}',
      handler: { file: this.handleStaticContentRequest_ }
    });
    await this.server_.start();
    process.env.DEBUG &&
      console.log(
        `astorytellinggame server running at :${this.server_.info.uri}`
      );
  }

  /**
   * Stops the server.
   * @return {!Promise} Resolves when all pending responses are flushed.
   */
  stop() {
    return this.server_.stop();
  }

  /**
   * Handles new WebSockets connections.
   * @param {!WebSocket} ws
   * @private
   */
  handleWebSocketsConnection_(ws) {
    process.env.DEBUG && console.log('Client connected');
    new Connection(ws);
  }

  /**
   * Handles HTTP requests. For serving static site content.
   * @param {!Hapi.Request} request Created internally for each incoming request.
   * @private
   */
  handleStaticContentRequest_(request) {
    const staticFileDir = path.join(__dirname, '../client-dist');
    const file = request.params.filename || 'index.html';
    return `${staticFileDir}/${file}`;
  }
}

module.exports = Server;
