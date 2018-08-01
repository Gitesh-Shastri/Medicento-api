const Product = require('../models/Product');
const Delivery = require('../models/deliveryPerson');
const Pharmacy = require('../models/pharmacy');
const Person = require('../models/sperson');
const InventoryProduct = require('../models/InventoryProduct');
const ProductAndMedi = require('../models/productandmedi');
const Inventory = require('../models/Inventory');
const OrderItem = require('../models/SalesOrderItem');
const Order = require('../models/SalesOrder');
const Log = require('../models/logs');
const mongoose = require('mongoose');
const express = require('express'); 
const router = express.Router();
var nodeoutlook = require('nodejs-nodemailer-outlook');

/*
var email 	= require("emailjs");
var server 	= email.server.connect({
    user:	process.env.id,
    port: 587, 
    password: process.env.pass, 
    host:	"smtp-mail.outlook.com", 
    tls: {ciphers: "SSLv3"}
});
*/
/*var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
		   user: process.env.gmailid,
		   pass: process.env.password
       },
       tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});
*/
router.get('/m', (req, res) => {
    nodeoutlook.sendEmail({
        auth: {
            user: "giteshshastri123@outlook.com",
            pass: "shastri@1"
        }, from: 'giteshshastri123@outlook.com',
        to: 'giteshshastri96@gmail.com, giteshshastri100@gmail.com ',
        subject: 'Heroku Test',
        html: '<b>This is bold text</b>',
    });
    res.send('felnke');
});

router.get('/medi',(req, res) => {
    count = req.body.length;
    a = 0;
    for(i=0;i<count;i++) {
    const inventoryProduct = new InventoryProduct();
        inventoryProduct.inventory_product_id =  new mongoose.Types.ObjectId();
        inventoryProduct.inventory_id =  "5b2e2e31f739e00600387bdf";
        inventoryProduct.product_name = req.body[i].PrName;
        inventoryProduct.stock_left = req.body[i].Stock;
        inventoryProduct.discount = "0";
        inventoryProduct.cost_for_medicento = req.body[i].SaleRate;
        inventoryProduct.manufacturing_date =  "2018-04-07T00:00:00.000Z";
        inventoryProduct.expiry_date = "2018-12-12T00:00:00.000Z";
        inventoryProduct.price_to_seller = req.body[i].SaleRate;
        inventoryProduct.price_to_retailer = req.body[i].SaleRate;
        inventoryProduct.tax_price_to_retailer = req.body[i].Mrp;
        inventoryProduct.tax_percentage = "18";
        inventoryProduct.scheme = "No";
        inventoryProduct.percentage_scheme = "0";
        inventoryProduct.batch_number = "0000";
    inventoryProduct.save();
    const product = new Product();
        product.product_id = new mongoose.Types.ObjectId();
        product.medicento_name = req.body[i].PrName;
        product.product_code = req.body[i].Code;
        product.company_name = req.body[i].MfName;
        product.total_stock = req.body[i].Stock;
        product.contents = "fkewnfkjenwfwk";
        product.package_type = "Box";
        product.description = "fekwnfkwe";
        product.category = "Tab";
        product.box_quantity = "10";
    product.save();
    const productandmedi = new ProductAndMedi({
        product_id: product._id,
        inventory_product_id: inventoryProduct._id 
    });
    productandmedi.save();
        a = a+1;
    }
    res.status(200).json({
        arr: a    });
});

router.get('/log', (req, res) => {
    const log = Log();
    log.logd = 'fekjbfjebf';
    log.created_at = new Date();
    log.save();
    res.send(log);
});
router.get('/medimap', (req, res) => {
    ProductAndMedi.find()
        .populate('product_id', 'medicento_name company_name')
        .populate('inventory_product_id', 'price_to_seller')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        medicento_name: doc.product_id.medicento_name,
                        company_name: doc.product_id.company_name,
                        price: doc.inventory_product_id.price_to_seller,
                        _id: doc._id
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/delivery', (req, res, next) => {
    Delivery.findOne({ user_email: req.query.user_email, password: req.query.password }).exec().then(doc => {
        res.status(201).json({
            is_first_time_sign_in: doc.is_first_time_sign_in,
            user_name: doc.user_name,
            full_name: doc.full_name,
            phone_no: doc.phone_no,
            date_of_birth: doc.date_of_birth,
            total_deliveries: doc.total_deliveries,
            avg_delivery_time: doc.avg_delivery_time
        })
    })   
});

router.post('/delivery', (req, res, next) => {
    const delivery = new Delivery(req.body).save()
    .then( doc => {
        console.log(doc);
        res.status(201).json({
            doc: doc
        })
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            err: err
        })
    });
});

router.post('/order', (req, res, next) => {
    const log = new Log();
    log.logd = JSON.stringify(req.body);
    log.created_at = new Date();
    log.save();
    console.log(log);
    Pharmacy.findOne({_id: req.body[0].pharma_id}).exec().then((docp) => { 
    message = '<h3>Pharmacy Name :'+ docp.pharma_name +'</h3><h4>Area Name : Kormangla</h4><h5>Medicine List : </h5>';
    message += '<table border="1"><tr><th>Medicine Name</th><th>Quantity</th><th>Cost</th></tr>';
    var deliverdate = new Date();
    deliverdate.setDate(deliverdate.getDate() + 1);
    deliverdate = deliverdate.toLocaleDateString();
    count = req.body.length;
    total = 0;
    orderid = '';
    for (i = 0; i < count; i++) {
        cost = Number(req.body[i].cost);
        total += cost;
    }
    orders = [];
    for (i = 0;i < count; i++) {
        const orderItem = new OrderItem();
            orderItem.quantity = req.body[i].qty,
            orderItem.paid_price = req.body[i].rate,
            orderItem.created_at = new Date(),
            orderItem.medicento_name = req.body[i].medicento_name,
            orderItem.company_name = req.body[i].company_name,
            orderItem.total_amount = req.body[i].cost
        orderItem.save();
        orders.push(orderItem._id);
        message += '<tr><td>'+req.body[i].medicento_name+'</td><td>'+req.body[i].qty+'</td><td>'+req.body[i].cost+'</td></tr>'
    }
    const order = new Order();
    order.created_at = new Date();
    order.pharmacy_id = req.body[0].pharma_id;
    order.sales_person_id = req.body[0].salesperson_id;
    order.grand_total = total;
    order.delivery_date = deliverdate;
    order.status = 'Active';
    for(i=0;i< count;i++){
        order.order_items.push(orders[i]);    
    }
    order.save();
    console.log(order);
 /*  var message1	= {
        text:	"i hope this works", 
        from:	"Gitesh <giteshmedicento@gmail.com>", 
        to:		"Gitesh <giteshmedicento@gmail.com>",
        subject:	"testing emailjs",
        attachment: 
        [
           {data: message, alternative:true}
        ]
     };
     
     // send the message and get a callback with an error or details of the message that was sent
     server.send(message1, function(err, message) { console.log(err || message); });
  */   /*var nodemailer = require('nodemailer');
 /*   const mailOptions = {
	    from: 'giteshmedicento@gmail.com', // sender address
	    to: 'giteshshastri100@gmail.com', // list of receivers
	    html: message + '<p>Grand Total = ' + total +'</p>'// plain text body
    };
    */
   content = 'Order has been placed by ' + docp.pharma_name + 'on' + order.delivery_date.toLocaleDateString(); // Subject line
   message = message + '<p>Grand Total = ' + total +'</p>';
   nodeoutlook.sendEmail({
    auth: {
        user: "giteshshastri123@outlook.com",
        pass: "shastri@1"
    }, from: 'giteshshastri123@outlook.com',
    to: 'giteshshastri96@gmail.com ',
    cc: 'rohit@medicento.com',
    bcc: 'arpandebasis@medicento.com ',
    subject: content,
    html: message,
});nodeoutlook.sendEmail({
    auth: {
        user: "giteshshastri123@outlook.com",
        pass: "shastri@1"
    }, from: 'giteshshastri123@outlook.com',
    to: 'giteshshastri96@gmail.com ',
    cc: 'arpandebasis@medicento.com ',
    subject: content,
    html: message,
});
   Person.findOne({ _id:req.body[0].salesperson_id })
        .exec()
        .then(sales => {
            console.log("Sales id : " , sales);
            Person.update({_id: sales._id},
                { Total_sales: sales.Total_sales+total, No_of_order: sales.No_of_order+1, Earnings: sales.commission*(sales.Total_sales+total)})
                .exec().then((err, updated) => {

     /*             transporter.sendMail(mailOptions, function (err, info) {
                        if(err)
                          console.log(err)
                        else
                          console.log(info);
                     });
		*/   
                res.status(200).json({
                    message: "Order has been placed successfully",
                    delivery_date: order.delivery_date.toLocaleString(),
                    order_id: order._id                        
                    });
                    });
                });
                    });
                });
router.get('/order', (req, res, next) => {
    Order.find()
        .exec()
        .then(doc => {
            res.status(200).json({
                order: doc
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.post('/inventory', (req, res) => {
    const inventory = new Inventory({
        inventory_id: new mongoose.Types.ObjectId(),
        inventory_name: req.body.inventory_name,
        contact_person: req.body.contact_person,
        phone_number: req.body.phone_number,
        Address: req.body.address,
        GST_Number: req.body.GST_Number,
        DL_Number: req.body.DL_Number,
        email: req.body.email
    });
    inventory.save().then(result => {
        res.status(201).json({
            Inventory: result
        })
    });
});

router.post('/inventoryProduct', (req, res) => {
    const inventoryProduct = InventoryProduct({
        inventory_product_id: new mongoose.Types.ObjectId(),
        inventory_id: req.body.inventory_id,
        product_name: req.body.product_name,
        stock_left: req.body.stock_left,
        discount: req.body.discount,
        cost_for_medicento: req.body.cost_for_medicento,
        manufacturing_date: req.body.manufacturing_date,
        expiry_date: req.body.expiry_date,
        price_to_seller: req.body.price_to_seller,
        price_to_retailer: req.body.price_to_retailer,
        tax_price_to_retailer: req.body.tax_price_to_retailer,
        tax_percentage: req.body.tax_percentage,
        scheme: req.body.scheme,
        percentage_scheme: req.body.percentage_scheme,
        batch_number: req.body.batch_number
    });
    inventoryProduct.save().then(result => {
        res.status(201).json({
            inventoryProduct: result
        })
    });
});

router.get('/inventoryProductc', (req, res) => {
    InventoryProduct.Update({ product_name: req.body.proname }, {$set: {stock_left: req.body.stock, cost_for_medicento: req.body.price, price_to_seller: req.body.price, price_to_retailer: req.body.price}}, function(err, doc) {
        res.status(200).json({doc: doc});
    });
});

router.post('/details', (req, res) => {
    const product = Product({
        product_id: new mongoose.Types.ObjectId(),
        medicento_name: req.body.medicento_name,
        product_code: req.body.product_code,
        company_name: req.body.company_name,
        total_stock: req.body.total_stock,
        contents: req.body.contents,
        package_type: req.body.package_type,
        description: req.body.description,
        category: req.body.category,
        box_quantity: req.body.box_quantity
    });
    product.save().then(result => {
        res.status(201).json({
            product: result
        });
    });
});

router.post('/medimap', (req, res) => {
    const productandmedi = new ProductAndMedi({
        product_id: req.body.product_id,
        inventory_product_id: req.body.inventory_product_id
    });
    productandmedi.save().then(result => {
        res.status(201).json({
            productandmedi: result
        })
    });
});

module.exports = router;
