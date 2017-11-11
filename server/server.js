const http = require('http');
const WebSocket = require('ws');

class Server {
  constructor(port = 3000) {
    this.port = port;
  }

  start() {
    this.server = http.createServer(this.requestHandler);
    const wss = new WebSocket.Server({ server: this.server });
    this.server.listen(this.port, (err) => console.log);
    process.env.DEBUG &&
      console.log(`astorytellinggame server started on :${this.port}`);
  }

  stop() {
    return new Promise((resolve) => {
      this.server.close(resolve)
    });
  }

  requestHandler(request, response) {
    process.env.DEBUG && console.log(request.url);
    response.end('A Storytelling Game');
  }
}

module.exports = Server;
