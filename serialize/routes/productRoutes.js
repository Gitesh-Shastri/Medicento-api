const Product = require('../models/Product');
const Delivery = require('../models/deliveryPerson');
const Person = require('../models/sperson');
const InventoryProduct = require('../models/InventoryProduct');
const ProductAndMedi = require('../models/productandmedi');
const Inventory = require('../models/Inventory');
const OrderItem = require('../models/SalesOrderItem');
const Order = require('../models/SalesOrder');
const mongoose = require('mongoose');
const express = require('express'); 
const router = express.Router();

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
    date = new Date();
    delivery_date = new Date(+new Date() + 3 * 24 * 60 * 60 * 1000);
    date.toLocaleTimeString();
    date = new Date(); 
    delivery_date = new Date(+new Date() + 3*24*60*60*1000);
    date.toLocaleString();  
    localDate = "" + date;
    count = req.body.length;
    total = 0;
    orderid = '';
    for (i = 0; i < count; i++) {
        cost = Number(req.body[i].cost);
        total += cost;
    }
    orders = [];
    for (i = 0; i < count; i++) {
        const orderItem = new OrderItem({
            quantity: req.body[i].qty,
            paid_price: req.body[i].rate,
            created_at: localDate,
            medicento_name: req.body[i].medicento_name,
            company_name: req.body[i].company_name,
            total_amount: req.body[i].cost
        });
        orderItem.save();
        orders.push(orderItem._id);
    }
    const order = new Order();
    order.created_at = localDate;
    order.pharmacy_id = req.body[0].pharma_id;
    order.sales_person_id = req.body[0].salesperson_id;
    order.grand_total = total;
    order.status = 'active';
    for(i=0;i< count;i++){
        order.order_items.push(orders[i]);    
    }
    order.save();
    Person.findOne({ _id:req.body[0].salesperson_id })
        .exec()
        .then(sales => {
            console.log("Sales id : " , sales);
            Person.update({_id: sales._id},
                { Total_sales: sales.Total_sales+total, No_of_order: sales.No_of_order+1, Earnings: sales.commission*(sales.Total_sales+total)})
                .exec().then((err, updated) => {
                    res.status(200).json({
        message: "Order has been placed successfully",
        order_id: order._id,
        delivery_date: delivery_date.toDateString()
                });
            });
        })
    
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
