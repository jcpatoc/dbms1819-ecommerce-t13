const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Client } = require('pg'); 
const nodemailer = require('nodemailer');   
const exphbs = require('express-handlebars');
var user;
var pass;

const app = express();
// instantiate client using your DB configurations
const client = new Client({
  database: 'dad3nvtrvsulfi',
  user: 'gkmjsudahylcjd',
  password: '483eecca7774e1360b07a839ae5151895e1e7b04cd6dca38e401526e923049e4',
  host: 'ec2-54-227-241-179.compute-1.amazonaws.com',
  port: 5432,
  ssl: true 
}); 
app.set('port', (process.env.PORT || 4000));


// connect to database
client.connect()
  .then(function() {
    console.log('connected to database!')
  })
  .catch(function(err) {
    console.log('cannot connect to database!')
  });


// tell express which folder is a static/public folder
app.use(express.static(path.join(__dirname, 'views')));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars'); 


app.get('/about', function(req, res) {
  res.render('about');
});


app.get('/', function(req, res) {

  client.query('SELECT * FROM Products')
   .then((results)=>{
    res.render('list', results);
  })
  .catch((err)=>{
    console.log('error',err);
    res.send('Error!');

  });
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/order', function(req, res) {
  console.log('req.body', req.body);
  client.query("INSERT INTO customer_list (first_name, last_name, email) VALUES ('"+req.body.fname+"','"+req.body.lname+"','"+req.body.email+"')",
    (req, data)=> {
  console.log(req, data)
    res.redirect('/customers/list')
  });
}); 
app.get('/customers/list', function(req, res) {
  client.query('SELECT * FROM customer_list')
  .then((results)=>{
    res.render('customers-list', results); 
      
    })
    .catch((err)=>{
      console.log('error', err);
      res.send('Error!');
    });
}); 
 app.post('/order', function(req, res) {
  console.log('req.body', req.body);
  client.query("INSERT INTO customer_details (street, municipality, province, zipcode) VALUES ('"+req.body.street+"','"+req.body.municipality+"','"+req.body.province+"','"+req.body.zipcode+"')",
    (req, data)=> {
  console.log(req, data)
    res.redirect('/customer/:id')
  });
}); 
app.get('/customer/:id', function(req, res) {
  client.query('SELECT * FROM customer_details')
  .then((results)=>{
    res.render('customer-id', results); 
      
    })
    .catch((err)=>{
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/customer/:id', function(req, res) {
  res.render('customer-id');
});


app.get('/customers/list', function(req, res) {
  res.render('customers-list');
}); 

 /* app.post('/order', function(req, res) {
  console.log('req.body', req.body);
  client.query("INSERT INTO customers (email, first_name,  last_name, street, municipality, province, zipcode) VALUES ('"+req.body.email+"','"+req.body.fname+"','"+req.body.lname+"','"+req.body.street+",'"+req.body.municipality+"','"+req.body.province+"','"+req.body.zipcode+"')",
    (req, data)=> {
  console.log(req, data)
    res.redirect('/customers/list') 
  });
}); 

app.get('/customers/list', function(req, res) {
  client.query('SELECT * FROM customers')
  .then((results)=>{
    res.render('customers-list', results); 
      
    })
    .catch((err)=>{
      console.log('error', err);
      res.send('Error!');
    });
}); */

app.get('/customers/list', function(req, res) {
  res.render('customers-list');
}); 

app.get('/order', function(req,res) {
  res.render('order');
});


app.post('/category/create', function(req, res) {
  console.log('req.body', req.body);
  client.query("Insert into products_category (category_name) VALUES ('"+req.body.name+"')",
    (req, data)=> {
  console.log(req, data)
    res.redirect('/categories')
  });
});


app.get('/categories', function(req, res) {
  client.query('SELECT * FROM products_category')
  .then((results)=>{
    res.render('categories', results); 
      
    })
    .catch((err)=>{
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/category/create', function(req, res) {
  res.render('categories-create');
}); 


app.post('/brands/create', function(req, res) {
  console.log('req.body', req.body);
  client.query("Insert into brands (brandname, description) VALUES ('"+req.body.brandname+"','"+req.body.description+"')", 
  (req, data)=> {
  console.log(req, data)
    res.redirect('/brands')
  });
});

app.get('/brands', function(req, res) {
  client.query('SELECT * FROM brands')
  .then((results)=>{
    res.render('brands', results); 
      
    })
    .catch((err)=>{
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/brands/create', function(req, res) {
  res.render('brands-create');
});


/*app.post('/orders', function(req, res) {
  console.log('req.body', req.body);
  client.query("Insert into orders (id, customer_id, product_id,  order_date, quantity) VALUES ('"+req.body.custID+"','"+req.body.prodID+"','"+req.body.date+"','"+req.body.quantity+"', CURRENT_TIMESTAMP)",
    (req, data)=> {
  console.log(req, data)
    res.redirect('/orders/list')
  });
});

app.get('/orders/list', function(req, res) {
  client.query('SELECT * FROM orders')
  .then((results)=>{
    res.render('orders-list', results); 
      
    })
    .catch((err)=>{
      console.log('error', err);
      res.send('Error!');
    });
}); */

app.get('/orders/list', function(req, res) {
  res.render('orders-list');
});


app.post('/order', function(req, res) {
  console.log(req.body);
  var id = req.params.id;
  var email =req.body.email;
  var customers_values = [req.body.email,req.body.fname,req.body.lname,req.body.street,req.body.municipality,req.body.province,req.body.zipcode];
  var orders_values = [req.body.customer_id, req.body.product_id, req.body.order_date, req.body.quantity];
  const output1 = `
    <h1>Your Order Request has been received!</h1>
    <p>Invoice</p>
    <ul>
      <li>Customer Name: ${req.body.fname} ${req.body.lname}</li>
      <li>Email: ${req.body.email}</li>
      <li>Address: ${req.body.street} ${req.body.municipality} ${req.body.province}</li>
      <li>Product ID: ${req.body.id}</li>
      <li>Zipcode: ${req.body.zipcode}</li>
      <li>Quantity: ${req.body.quantity}</li>
    </ul>
    
  
  `;
  const output2 = `
    <h1>You have a new Order Request!</h1>
    <p>Invoice</p>
    <ul>
      <li>Customer Name: ${req.body.fname} ${req.body.lname}</li>
      <li>Email: ${req.body.email}</li>
      <li>Address: ${req.body.street} ${req.body.municipality} ${req.body.province}</li>
      <li>Product ID: ${req.body.id}</li>
      <li>Zipcode: ${req.body.zipcode}</li>
      <li>Quantity: ${req.body.quantity}</li>
    </ul>
  `;

  client.query('SELECT email FROM customers', (req,data)=> {
    var list;
    var exist = 0;
    console.log(email);
    console.log("exists");
    for (var i = 0; i < data.rows.length; i++) {
      list = data.rows[i].email;
      //JSON.stringify(list);
      console.log(list);
      if (list==email) {
        exist=1;
      }
    }

    if (exist==1) {
      console.log("email exists");
      //'/products/:id'
      client.query('SELECT id FROM customers WHERE email=$1', [email], (err,data)=> {
        if (err) {
          console.log(err.stack)
        }
        else {
          console.log(data.rows);
          console.log("existing account");
          orders_values[2] = data.rows[0].id;
          console.log(orders_values+"<====")
          client.query('INSERT INTO orders(id, customer_id, product_id,  order_date, quantity) VALUES($1, $2, $3, $4, $5)', orders_values, (req,data)=> {
            //nodemailer
              let transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                user: 'dbms.team13@gmail.com',
                pass: 'Password1.'
              }
              });

            let mailOptions1 = {
              from: '"Team13" <dbms.team13@gmail.com>',
              to: email,
              subject: 'Order Received!',
              html: output1
            };

            let mailOptions2 = {
              from: '"Team13" <dbms.team13@gmail.com>',
              to: 'dbms.team13@gmail.com',
              subject: 'New Order from Team13',
              html: output2
            };

            transporter.sendMail(mailOptions1, (error, info)=>{
              if (error) {
                return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });

            transporter.sendMail(mailOptions2, (error, info)=>{
              if (error) {
                return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
          });
          res.redirect('/customers-list');  
        }
      });
    }
    else {
      console.log("account do not exist");
      console.log(customers_values);
      client.query('INSERT INTO customers(email, first_name, last_name, street, municipality, province, zipcode) VALUES($1, $2, $3, $4, $5, $6, $7)', customers_values, (err,data)=> {
        if (err) {
          console.log(err.stack)
        }
        else {
          client.query('SELECT lastval()', (err,data)=> {
            if (err) {
              console.log(err.stack)
            }
            else {
              console.log(data.rows);
              console.log("!");
              orders_values[2] = data.rows[0].lastval;
              console.log(orders_values+"<====")
              client.query('INSERT INTO orders(id, customer_id, product_id,  order_date, quantity) VALUES($1, $2, $3, $4, $5, $6)', orders_values, (req,data)=> {
                
                let transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 465,
                  secure: true,
                  auth: {
                    user: 'dbms.team13@gmail.com',
                    pass: 'Password1.'
                  }
                  });

                let mailOptions1 = {
              from: '"Team13" <dbms.team13@gmail.com>',
              to: email,
              subject: 'Order Received!',
              html: output1
            };

            let mailOptions2 = {
              from: '"Team13" <dbms.team13@gmail.com>',
              to: 'dbms.team13@gmail.com',
              subject: 'New Order from Team13',
              html: output2
            };

                  transporter.sendMail(mailOptions1, (error, info)=>{
                      if (error) {
                          return console.log(error);
                      }
                      console.log('Message sent: %s', info.messageId);
                      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                   });

                  transporter.sendMail(mailOptions2, (error, info)=>{
                      if (error) {
                          return console.log(error);
                      }
                      console.log('Message sent: %s', info.messageId);
                      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                   });
              });
              res.redirect('/customers-list'); 
            }
          });
        }
      });
    }
  });
});


app.get('/products/:id/email-exists', function(req,res) {
  var id = req.params.id;
  res.render('email', {
    message: 'Email already exists!',
    PID: id
  });
});

app.get('/orders-list', (req,res)=>{
  client.query('SELECT * FROM orders', (req, data)=>{
    var list = [];
    for (var i = 1; i < data.rows.length+1; i++) {
        list.push(data.rows[i-1]);
    }
    res.render('orders-list',{
      data: list
    });
  });
});
app.get('/customers-list', function(req, res) {
  client.query('SELECT * FROM customers')
  .then((results)=>{
    res.render('customers', results); 
      
    })
    .catch((err)=>{
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/customer/:id', (req,res)=>{
  var id = req.params.id;
  console.log(id);
  client.query('SELECT orders.id, orders.customer_id, orders.product_id, orders.purchase_date, orders.quantity, customers.email, customers.first_name, customers.last_name, customers.street,customers.city,customers.number, products.product_name FROM orders INNER JOIN customers ON orders.customer_id = customers.id INNER JOIN products ON orders.product_id = products.id WHERE orders.customer_id = $1', [id], (err, data)=>{
    if (err) {
      console.log(err);
    }
    else{
      var list = [];
      console.log(data.rows);
      for (var i = 1; i < data.rows.length+1; i++) {
        list.push(data.rows[i-1]);
      }
      data.rows[0];
      res.render('customers-list',{
        data: list,
        first_name: list[0].first_name,
        last_name: list[0].last_name,
        customer_id: list[0].customer_id,
        email: list[0].email,
        street: list[0].street,
        municipality: list[0].municipality,
        province: list[0].province,
        zipcode: list[0].zipcode

      });
    }
  });
});

app.get('/customer/:id', function(req, res) {
  res.render('customer-id');
});


app.get('/customers/list', function(req, res) {
  res.render('customers-list');
}); 


app.post('/products/create', function(req, res) {
  console.log('req.body', req.body);
  client.query("Insert into products_create (product_name, product_description,  tagline, price, warranty, images, category_id,, brand_id) VALUES ('"+req.body.id+"','"+req.body.name+"','"+req.body.description+"','"+req.body.tagline+"','"+req.body.price+"','"+req.body.warranty+"','"+req.body.images+"','"+req.body.category_id+"','"+req.body.brand_id+"')",
    (req, data)=> {
  console.log(req, data)
    res.redirect('/')
  });
});
 
app.get('/products/create', function(req, res) {  
  client.query('SELECT * FROM brands',(req, data)=>{
    var brands = [];
    for (var i = 1; i < data.rows.length+1; i++){
      brands.push(data.rows[i-1]);  
    }
  client.query('SELECT * FROM products_category',(req, data)=>{
    var products_category = [];
    for (var i = 1; i < data.rows.length+1; i++){
      products_category.push(data.rows[i-1]);
    }
    res.render('products-create',{
      brands: brands,
      category: products_category
      });
    });
  });
});
app.post('/products/update', function(req, res) {
  console.log('req.body', req.body);
  client.query("Insert into product (product_name, product_description,  tagline, price, warranty, images, category_id, brand_id) VALUES ('"+req.body.product_name+"','"+req.body.product_description+"','"+req.body.tagline+"',,'"+req.body.price+"','"+req.body.warranty+"','"+req.body.images+"','"+req.body.category_id+"','"+req.body.brand_id+"')",
    (req, data)=> {
  console.log(req, data)
    res.redirect('/')
  });
});
 
app.get('/products/update', function(req, res) {  
  client.query('SELECT * FROM brands',(req, data)=>{
    var brands = [];
    for (var i = 1; i < data.rows.length+1; i++){
      brands.push(data.rows[i-1]);
    }
  client.query('SELECT * FROM products_category',(req, data)=>{
    var products_category = [];
    for (var i = 1; i < data.rows.length+1; i++){
      products_category.push(data.rows[i-1]);
    }
    res.render('list',{
      brands: brands,
      category: products_category
      });
    });
  });
});
app.get('/category/create', function(req, res) {
  res.render('categories-create');
});


app.listen(app.get('port'), function(){
  console.log('Server started on port' +app.get('port'))
});

