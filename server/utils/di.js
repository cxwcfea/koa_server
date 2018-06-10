const { asClass, createContainer } = require('awilix');

const OrderService = require('../components/orders/order.service');

// const logger = require('../utils/logger');

const container = createContainer();
container.register({
  // logger: asValue(logger),
  orderService: asClass(OrderService).scoped(),
});

module.exports = container;
