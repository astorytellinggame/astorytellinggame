const Server = require('./server/server');

new Server(process.env.PORT || 3000).start();
