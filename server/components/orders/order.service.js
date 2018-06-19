const orders = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    price: 2,
    cnt: 3,
  },
  {
    id: 2,
    userId: 2,
    productId: 2,
    price: 2,
    cnt: 1,
  },
];

class OrderService {
  constructor({ logger, currentUser }) {
    this.logger = logger;
    this.currentUser = currentUser;
  }

  listOrders() {
    this.logger.debug('process in order service listOrders');
    orders.forEach((item) => {
      item.userId = this.currentUser.profileId;
    });
    return orders;
  }
}

module.exports = OrderService;
