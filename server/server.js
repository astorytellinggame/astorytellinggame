const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

class Server {
  constructor(port = 3000) {
    this.port = port;
  }

  requestHandler(request, response) {
    process.env.DEBUG && console.log(request.url);
    switch(request.url) {
      case '/':
        this.serveFile('index.html', 'text/html', response);
        break;
      case '/bundle.js':
        this.serveFile('bundle.js', 'text/javascript', response);
        break;
      case '/favicon.ico':
        this.serveFile('favicon.ico', 'image/x-icon', response);
        break;
      default:
        process.env.DEBUG && console.log(`Unexpected request: ${request.url}`);
        this.serve404(response);
    }
  }

  start() {
    this.server = http.createServer(this.requestHandler.bind(this));
    const wss = new WebSocket.Server({ server: this.server });
    this.server.listen(this.port, (err) => console.log);
    process.env.DEBUG &&
      console.log(`astorytellinggame server started on :${this.port}`);
  }

  serve404(response) {
    response.writeHead(404);
    response.end();
  }

  /**
   * Serves the file in client-dist to the response and closes the response.
   * @param {string} filename The filename (relative to client-dist) to serve.
   * @param {string} contentType e.g., 'text/javascript'
   * @param {http.ServerResponse} response Output will be flushed to this.
   */
  serveFile(filename, contentType, response) {
    fs.readFile(`./client-dist/${filename}`, (err, content) => {
      if (err) {
        console.error(err);
        serve404(response);
        return;
      }
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    });
  }

  stop() {
    return new Promise((resolve) => {
      this.server.close(resolve)
    });
  }
}

module.exports = Server;
