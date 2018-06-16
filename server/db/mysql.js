const Sequelize = require('sequelize');

const config = require('../config');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
  config.mysql.db,
  config.mysql.username,
  config.mysql.password,
  {
    timezone: '+08:00',
    dialect: 'mysql',
    host: config.mysql.host,
    port: config.mysql.port,
    dialectOptions: {
      socketPath: config.mysql.socketPath,
    },
    define: {
      freezeTableName: true,
      timestamps: false,
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci',
      },
    },
    pool: {
      max: 10,
      min: 0,
    },
    logging: config.mysql.debug === 'true' ? logger.info : false,
  },
);

function defineModel(name, attributes, options) {
  const attrs = {};
  attrs.id = {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  };

  Object.keys(attributes).forEach((key) => {
    const value = attributes[key];
    if (typeof value === 'object' && value.type) {
      value.allowNull = value.allowNull || false;
      attrs[key] = value;
    } else {
      attrs[key] = {
        type: value,
        allowNull: false,
      };
    }
  });

  attrs.created_at = {
    type: Sequelize.BIGINT,
    allowNull: false,
  };
  attrs.updated_at = {
    type: Sequelize.BIGINT,
    allowNull: false,
  };
  return sequelize.define(name, attrs, {
    ...options,
    version: true,
    freezeTableName: true,
    /*
    hooks: {
      ...options.hooks,
      beforeValidate(obj) {
        const now = Date.now();
        if (obj.isNewRecord) {
          obj.created_at = now;
        }
        obj.updated_at = now;
      },
    },
    */
  });
}

sequelize.addHook('beforeValidate', (obj) => {
  const now = Date.now();
  if (obj.isNewRecord) {
    obj.created_at = now;
  }
  obj.updated_at = now;
});

if (config.mysql.syncDB === true) {
  sequelize
    .sync()
    .then(() => console.log('mysql sync done'))
    .catch((err) => {
      console.error('mysql sync error', err);
    });
}

module.exports = {
  sequelize,
  defineModel,
  Sequelize,
};
