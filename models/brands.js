var Brands = {
  list: (client, filter, callback) => {
    const brandListQuery = `
      SELECT
        brands.id,
        brands.brandname,
        brands.description
      FROM brands
      ORDER BY id ASC
    `;
    client.query(brandListQuery, (req, data) => {
      console.log(req);
      callback(data.rows);
    });
  }
};
module.exports = Brands;
