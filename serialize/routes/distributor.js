const Product = require("../models/Product");
const OrderCode = require("../models/sales_order_code");
const Pharmacy = require("../models/pharmacy");
const Review = require("../models/review");
const Person = require("../models/sperson");
const User = require('../models/user');
const InventoryProduct = require("../models/InventoryProduct");
const ProductAndMedi = require("../models/productandmedi");
const Inventory = require("../models/Inventory");
const OrderItem = require("../models/SalesOrderItem");
const fs = require("fs");
const Order = require("../models/SalesOrder");
const Log = require("../models/logs");
const mongoose = require("mongoose");
const areadelivery = require("../models/area_and_delivery");
const express = require("express");
const router = express.Router();
const moment = require("moments");
const OfferInventory = require("../models/offermedicine");
const Camp = require("../models/camp");
const fast_csv = require("fast-csv");
const vpiinventory = require("../models/vpimedicine");
const tulsiinverntory = require("../models/tulsimedicines");
var nodeoutlook = require("nodejs-nodemailer-outlook");

router.get('/party_code', (req, res, next) => {

    User.findOne({ usercode: req.query.pharma_code })
    .exec()
    .then( user => {
        Person.findOne({user: user._id})
        .populate('user')
        .populate('Allocated_Pharma')
        .exec()
        .then( pserson => {
            res.status(200).json({message: 'Updated', person: pserson});  
        })
        .catch( err => {
            res.status(200).json({message: 'Error Occured Try Again'});
        });  
    })
    .catch( err => {
        res.status(200).json({message: 'Error Occured Try Again'});
    });

}); 

router.get('/distributor_order_id', (req, res, next) => {

    Order.findOne({ sales_order_code: req.query.order_id })
    .exec()
    .then( order =>{
        order.distributor_order_id = req.query.distributor_order_id;
        order.save();
        res.status(200).json({message: 'Updated', order: order});  
    })
    .catch(err => {
        res.status(200).json({message: 'Error Occured Try Again'});
    })

});

router.get('/distributor_invoice_id', (req, res, next) => {

    Order.findOne({ sales_order_code: req.query.order_id })
    .exec()
    .then( order =>{
        order.distributor_invoice_id = req.query.distributor_invoice_id;
        order.save();
        res.status(200).json({message: 'Updated', order: order});  
    })
    .catch(err => {
        res.status(200).json({message: 'Error Occured Try Again'});
    })

});

module.exports = router;