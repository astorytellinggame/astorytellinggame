const http = require('http');

class Server {
  constructor(port = 3000) {
    this.port = port;
  }

  start() {
    const server = http.createServer(this.requestHandler);
    server.listen(this.port, (err) => console.log);
    console.log(`astorytellinggame server started on :${this.port}`);
  }

  requestHandler(request, response) {
    console.log(request.url);
    response.end('A Storytelling Game');
  }
}

module.exports = Server;
