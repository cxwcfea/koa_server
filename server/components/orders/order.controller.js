class OrderController {
  constructor({ logger, orderService }) {
    this.logger = logger;
    this.orderService = orderService;
  }

  list(ctx) {
    this.logger.debug('process in order controller list');
    const orders = this.orderService.listOrders();
    ctx.body = orders;
  }
}

module.exports = OrderController;
