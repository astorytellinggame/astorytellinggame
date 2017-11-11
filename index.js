const http = require('http');

const PORT = process.env.PORT || 3000;

const requestHandler = (request, response) => {
  console.log(request.url);
  response.end('A Storytelling Game');
};

const server = http.createServer(requestHandler);
server.listen(PORT, (err) => console.log);
console.log(`astorytellinggame server started on :${PORT}`);
