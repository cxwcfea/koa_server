const { asClass, asValue, createContainer } = require('awilix');
const joi = require('joi');

const OrderService = require('../components/orders/order.service');
const AuthService = require('../components/auth/auth.service');
const DB = require('../db/mysql');
const models = require('../db/model');

// const logger = require('../utils/logger');

DB.models = models;

const container = createContainer();
container.register({
  // logger: asValue(logger),
  authService: asClass(AuthService).scoped(),
  orderService: asClass(OrderService).scoped(),
  db: asValue(DB),
  validator: asValue(joi),
});

module.exports = container;
