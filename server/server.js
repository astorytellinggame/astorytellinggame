const Connection = require('./connection');
const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');
const path = require('path');

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
  start() {
    this.server_ = http.createServer(this.handleHttpRequest_.bind(this));
    const wss = new WebSocket.Server({ server: this.server_ });
    wss.on('connection', this.handleWebSocketsConnection_.bind(this));
    this.server_.listen(this.port, (err) => console.log);
    process.env.DEBUG &&
      console.log(`astorytellinggame server started on :${this.port}`);
  }

  /**
   * Stops the server.
   * @return {!Promise} Resolves when all pending responses are flushed.
   */
  stop() {
    return new Promise((resolve) => {
      this.server_.close(resolve)
    });
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
   * Handles plain HTTP requests. For serving static site content.
   * @param {!http.IncomingMessage} request
   * @param {!http.ServerResponse} response
   * @private
   */
  handleHttpRequest_(request, response) {
    process.env.DEBUG && console.log(`Serving static file request: ${request.url}`);
    switch(request.url) {
      case '/':
        this.serveFile_('index.html', 'text/html', response);
        break;
      case '/bundle.js':
        this.serveFile_('bundle.js', 'text/javascript', response);
        break;
      case '/favicon.ico':
        this.serveFile_('favicon.ico', 'image/x-icon', response);
        break;
      default:
        process.env.DEBUG && console.log(`Unexpected request: ${request.url}`);
        this.serve404_(response);
    }
  }

  /**
   * @param {http.ServerResponse} response Output will be flushed to this.
   * @private
   */
  serve404_(response) {
    response.writeHead(404);
    response.end();
  }

  /**
   * Serves the file in client-dist to the response and closes the response.
   * @param {string} filename The filename (relative to client-dist) to serve.
   * @param {string} contentType e.g., 'text/javascript'
   * @param {http.ServerResponse} response Output will be flushed to this.
   * @private
   */
  serveFile_(filename, contentType, response) {
    fs.readFile(
      path.resolve(__dirname, `../client-dist/${filename}`),
      (err, content) => {
        if (err) {
          console.error(err);
          this.serve404_(response);
          return;
        }
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
      });
  }
}

module.exports = Server;
