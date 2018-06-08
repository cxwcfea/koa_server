const path = require('path');
const { name, env } = require('./index');

const directory = process.env.LOG_DIR || path.join(__dirname, '../../log');
const filename = process.env.LOG_FILE || `${name}-${process.pid}.${env}.json.log`;

const config = {
  name,
  streams: [],
};

if (env === 'production') {
  config.streams.push({
    type: 'rotating-file',
    path: path.join(directory, filename),
    period: '1d',
    count: 10,
    level: process.env.LOG_LEVEL || 'info',
  });
  config.streams.push({
    type: 'stream',
    stream: process.stderr,
    level: 'warn',
  });
} else if (env === 'development') {
  config.streams.push({
    type: 'stream',
    stream: process.stdout,
    level: 'debug',
  });
}

module.exports = config;

