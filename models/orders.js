var Orders = {
  list: (client, filter, callback) => {
    const orderListQuery = `
      SELECT
        orders.id,
        orders.product_id,
        orders.customer_id,
        orders.quantity,
        orders.order_date
      FROM orders
      ORDER BY id ASC
    `;
    client.query(orderListQuery, (req, data) => {
      console.log(req);
      callback(data.rows);
    });
  }
};
module.exports = Orders;
