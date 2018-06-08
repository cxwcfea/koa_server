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

exports.list = (ctx) => {
  ctx.body = orders;
};
