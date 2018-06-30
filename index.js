const config = require('./server/config');
const server = require('./server/server');
const logger = require('./server/utils/logger');
const wsServer = require('./server/middleware/websocket');

// server.ws.use((ctx) => {
//   ctx.websocket.send('Hello World');
//   ctx.websocket.on('message', (message) => {
//     console.log(message);
//   });
// });
server.ws.use(wsServer());
server.listen(config.port, () => logger.info(`Server started on ${config.port}`));
