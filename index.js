const config = require('./server/config');
const server = require('./server/server');

server.listen(config.port, () => console.log(`Server started on ${config.port}`));
