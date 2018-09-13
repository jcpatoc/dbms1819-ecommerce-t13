var Product = {
  getById: (client, productId, callback) => {
    const productQuery = `
        SELECT 
        products.id,
        products.product_name as product_name,
        products.image as image,
        products.tagline as tagline
        products.product_description as product_description,
        products.price as price,
        products.warranty as warranty
        brands.brandname as brandname,
        products_category.name as catname
      FROM products
      INNER JOIN brands ON products.brand_id = brands.id
      INNER JOIN products_category ON products.category_id = products_category.id
    `;
    client.query(productQuery, (req, data) => {
      console.log(req);
      var productData = {
        id: data.rows[0].id,
        name: data.rows[0].product_name,
        image: data.rows[0].image,
        price: data.rows[0].price,
        tagline: data.rows[0].tagline,
        warranty: data.rows[0].warranty,
        description: data.rows[0].product_description,
        bname: data.rows[0].brandname,
        catname: data.rows[0].category_name
      };
      callback(data.rows);
    });
  },

  list: (client, filter, callback) => {
    const productListQuery = `
      SELECT
        products.id,
        products.product_name as product_name,
        products.image as image,
        products.tagline as tagline
        products.product_description as product_description,
        products.price as price,
        products.warranty as warranty
        brands.brandname as brandname,
        products_category.name as catname
      FROM products
      INNER JOIN brands ON products.brand_id = brands.id
      INNER JOIN products_category ON products.category_id = products_category.id
      ORDER BY id ASC
    `;
    client.query(productListQuery, (req, data) => {
      console.log(req);
      callback(data.rows);
    });
  }
};
module.exports = Product;
