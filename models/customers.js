var Customers = {
  list: (client, filter, callback) => {
    const customersListQuery = `
      SELECT
      customers.first_name,
      customers.last_name
      FROM customers
      ORDER BY id ASC
    `;
    client.query(customersListQuery, (req, data) => {
      console.log(req);
      callback(data.rows);
    });
  }
};
module.exports = Customers;
