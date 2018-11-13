const Product = require("../models/Product");
const OrderCode = require("../models/sales_order_code");
const Delivery = require("../models/deliveryPerson");
const Pharmacy = require("../models/pharmacy");
const Review = require("../models/review");
const Person = require("../models/sperson");
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
const Jobs = require("../models/jobs");
const DeliveryJobs = require("../models/delivery_jobs");
const router = express.Router();
const moment = require("moments");
const OfferInventory = require("../models/offermedicine");
const Camp = require("../models/camp");
const fast_csv = require("fast-csv");
const vpiinventory = require("../models/vpimedicine");
var nodeoutlook = require("nodejs-nodemailer-outlook");

router.get("/delivery", (req, res, next) => {
    Delivery.findOne({
            user_email: req.query.user_email
        })
        .populate("area_and_delivery", "area No_of_delivery")
        .exec()
        .then(doc => {
            res.status(200).json({
                _id: doc._id,
                delivery_pending: doc.delivery_pending,
                delivery_completed: doc.delivery_completed,
                collected_amount: doc.collected_amount,
                points: doc.points,
                area_and_delivery: doc.area_and_delivery
            });
        });
});

router.get("/delivery/profile", (req, res, next) => {
    Delivery.findOne({
            user_email: req.query.user_email
        })
        .exec()
        .then(doc => {
            res.status(200).json({
                _id: doc._id,
                user_name: doc.user_name,
                phone_no: doc.phone_no,
                date_of_birth: doc.date_of_birth,
                total_deliveries: doc.total_deliveries,
                avg_delivery_time: doc.avg_delivery_time
            });
        });
});

router.get("/delivery/login", (req, res, next) => {
    Delivery.findOne({
            user_email: req.query.user_email,
            password: req.query.password
        })
        .exec()
        .then(doc => {
            res.status(200).json({
                is_first_time_sign_in: doc.is_first_time_sign_in,
                message: "User Found"
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "No User Found"
            });
        });
});

router.post("/delivery/update_password", (req, res, next) => {
    Delivery.findOne({
            user_email: req.body.user_email
        })
        .exec()
        .then(doc => {
            Delivery.findByIdAndUpdate({
                    _id: doc._id
                }, {
                    $set: {
                        password: req.body.new_password,
                        is_first_time_sign_in: false
                    }
                }, {
                    new: true
                })
                .exec()
                .then(doc1 => {
                    res.status(200).json({
                        message: "Password Updated"
                    });
                })
                .catch(err => {
                    res.status(200).json({
                        message: "Password Updation Failed"
                    });
                });
        })
        .catch(err => {
            res.status(200).json({
                message: "No User Found"
            });
        });
});

router.post("/orderCode", (req, res, next) => {
    const order = new OrderCode();
    order.code = 10000000;
    order.save();
    res.status(200).json({
        order_code: order
    });
});

router.get("/jobs", (req, res, next) => {
    Jobs.findOne({
            _id: req.query.jobid
        })
        .populate("order")
        .exec()
        .then(doc => {
            Order.findOne({
                    _id: doc.order
                })
                .populate("order_items")
                .exec()
                .then(doco => {
                    res.status(200).json({
                        pickup_point: {
                            pickup_point_lat: doc.pickup_point_lat,
                            pickup_point_long: doc.pickup_point_long,
                            pickup_point_name: doc.pickup_point_name,
                            pickup_point_address: doc.pickup_point_address,
                            pickup_point_instruction: doc.pickup_point_instruction,
                            pickup_point_contact: doc.pickup_point_contact
                        },
                        delivery_point: {
                            delivery_point_lat: doc.delivery_point_lat,
                            delivery_point_long: doc.delivery_point_long,
                            delivery_point_name: doc.delivery_point_name,
                            delivery_point_address: doc.delivery_point_address,
                            delivery_point_instruction: doc.delivery_point_instruction,
                            delivery_point_contact: doc.delivery_point_contact
                        },
                        order: {
                            total_cost: doco.grand_total,
                            no_of_items: doco.order_items.length,
                            items: doco.order_items
                        }
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        err: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                err: err
            });
        });
});

router.post("/jobs", (req, res, next) => {
    const jobs = new Jobs(req.body)
        .save()
        .then(doc => {
            console.log(doc);
            res.status(201).json({
                doc: doc
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err: err
            });
        });
});

router.get("/delivery_jobs", (req, res, next) => {
    Delivery.findOne({
            user_email: req.query.user_email
        })
        .exec()
        .then(doc => {
            DeliveryJobs.findOne({
                    delivery_person: doc._id
                })
                .populate("pending_jobs")
                .populate("completed_jobs")
                .exec()
                .then(docs => {
                    console.log(docs);
                    res.status(201).json(docs);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        err: err
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err: err
            });
        });
});

router.post("/delivery_jobs", (req, res, next) => {
    const delivery_jobs = new DeliveryJobs();
    delivery_jobs.delivery_person = req.body.delivery_person;
    delivery_jobs.pending_jobs.push(req.body.pending_jobs);
    delivery_jobs.completed_jobs.push(req.body.completed_jobs);
    delivery_jobs.save();
    res.send("Hi");
});

router.post("/ch", (req, res, next) => {
    InventoryProduct.findOneAndUpdate({
            product_name: req.body.name
        }, {
            $set: {
                stock_left: req.body.stock
            }
        }, {
            new: true
        })
        .exec()
        .then((doc, err) => {
            if (err) {
                res.send(err);
            }
            res.send(doc);
        });
});

router.post("/feedback", (req, res, next) => {
    count = 0;
    for (i = 0; i < req.body.length; i++) {
        const review = new Review();
        review.pharma_name = req.body[i].pharma_name;
        review.dist_name = req.body[i].distributor_name;
        review.dist_order = req.body[i].distributor_order;
        review.dist_return = req.body[i].distributor_returns;
        review.dist_payment = req.body[i].distributor_payment;
        review.dist_bounce = req.body[i].distributor_bounce;
        review.dist_delivery = req.body[i].distributor_delivery;
        review.dist_behaviour = req.body[i].distributor_behaviour;
        review.area_name = req.body[i].area_name;
        review.sales = req.body[i].sales;
        review.save();
        count++;
    }
    res.status(200).json(count);
});

router.get("/offer", (req, res, next) => {
    OfferInventory.find()
        .select("Item_name manfc_name mrp qty")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            medicento_name: doc.Item_name,
                            company_name: doc.manfc_name,
                            price: doc.mrp,
                            stock: doc.qty,
                            _id: doc._id
                        };
                    })
                };
                res.status(200).json({
                    message: "Offer Available",
                    offermedicine: response
                });
            }
            res.status(200).json({
                message: "Offer Not Available"
            });
        })
        .catch(err => {
            res.status(400).json({
                message: "Offer Not Available"
            });
        });
});

router.post("/offer", (req, res, next) => {
    var vpi = new OfferInventory();
    vpi.Item_name = "-";
    vpi.batch_no = "-";
    vpi.expiry_date = "-";
    vpi.qty = 0;
    vpi.packing = "-";
    vpi.item_code = "-";
    vpi.mrp = 0;
    vpi.manfc_code = "-";
    vpi.manfc_name = "-";
    vpi.save();
    console.log(vpi);
});

router.get("/medi", (req, res) => {
    count = req.body.length;
    a = 0;
    for (i = 0; i < count; i++) {
        const inventoryProduct = new InventoryProduct();
        inventoryProduct.inventory_product_id = new mongoose.Types.ObjectId();
        inventoryProduct.inventory_id = "5b2e2e31f739e00600387bdf";
        inventoryProduct.product_name = req.body[i].PrName;
        inventoryProduct.stock_left = req.body[i].Stock;
        inventoryProduct.offer = req.body[i].Offers;
        inventoryProduct.save();
        const product = new Product();
        product.product_id = new mongoose.Types.ObjectId();
        product.medicento_name = req.body[i].PrName;
        product.company_name = req.body[i].MfName;
        product.total_stock = req.body[i].Stock;
        product.save();
        const productandmedi = new ProductAndMedi({
            product_id: product._id,
            inventory_product_id: inventoryProduct._id
        });
        productandmedi.save();
        a = a + 1;
    }
    res.status(200).json({
        arr: a
    });
});

router.get("/medimap", (req, res) => {
    vpiinventory
        .find()
        .select("Item_name manfc_name mrp qty item_code")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        medicento_name: doc.Item_name,
                        company_name: doc.manfc_name,
                        price: doc.mrp,
                        stock: doc.qty,
                        item_code: doc.item_code,
                        _id: doc._id
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get("/recent_order/:id", (req, res, next) => {
    Order.find({
            pharmacy_id: req.params.id,
            status: req.query.status
        })
        .select("status created_at grand_total")
        .populate("order_items")
        .exec()
        .then(docs => {
            const response = {
                orders: docs.map(doc => {
                    return {
                        order_id: doc._id,
                        created_at: doc.created_at,
                        grand_total: doc.grand_total,
                        order_items: doc.order_items
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get("/notification", (req, res, next) => {
    Camp.find()
        .exec()
        .then(doc => {
            var doc1 = doc[doc.length - 1];
            res.status(200).json({
                title: doc1.name,
                type: doc1.type,
                content: doc1.content
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post("/delivery/area_and_deliveryC", (req, res, next) => {
    Delivery.findOne({
            _id: req.query.id
        })
        .populate("area_and_delivery")
        .exec()
        .then(doc => {
            console.log(doc);
            for (i = 0; i < doc.area_and_delivery.length; i++) {
                if (doc.area_and_delivery[i].area == "5b28cf4a4381b00448fcbb27") {
                    areadelivery
                        .findByIdAndUpdate({
                            _id: doc.area_and_delivery[i]._id
                        }, {
                            $set: {
                                No_of_delivery: doc.area_and_delivery[i].No_of_delivery + 1
                            }
                        }, {
                            new: true
                        })
                        .exec()
                        .then(doc1 => {
                            res.send(doc1);
                        });
                } else {
                    res.send("fsdkkmf.,");
                }
            }
        });
});

router.post("/delivery", (req, res, next) => {
    const delivery = new Delivery(req.body)
        .save()
        .then(doc => {
            console.log(doc);
            res.status(201).json({
                doc: doc
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err: err
            });
        });
});

router.post("/order", (req, res, next) => {
    /*const log = new Log();
      log.logd = JSON.stringify(req.body);
      log.created_at = new Date();
      log.save(); */
    var csv = "Party Code, Item Code, Item Name, Qty\n";
    var date = new Date();
    console.log(date);
    OrderCode.find().exec().then(doc_order_code => {
        Pharmacy.findOne({
                _id: req.body[0].pharma_id
            })
            .populate("area")
            .exec()
            .then(docp => {
                message =
                    "<h3>Pharmacy Name: " +
                    docp.pharma_name +
                    "</h3><h4>Area Name: " +
                    docp.area.area_name +
                    "</h4><h4>Address : " +
                    docp.pharma_address +
                    "</h4>";
                message +=
                    '<table border="1" style="width:100%"><tr><th style="width:60%">Medicine Name</th><th style="width:20%">Medicine Code</th><th style="width:10%">Quantity</th><th style="width:10%">Cost</th></tr>';
                var deliverdate = date;
                deliverdate.setDate(deliverdate.getDate() + 1);
                deliverdate = deliverdate.toLocaleDateString();
                count = req.body.length - 1;
                total = 0;
                orderid = "";
                for (i = 0; i < count; i++) {
                    cost = Number(req.body[i].cost);
                    total += cost;
                }
                Person.findOne({
                        _id: req.body[0].salesperson_id
                    })
                    .populate("user")
                    .exec()
                    .then(salesP => {
                        orders = [];
                        for (i = 0; i < count; i++) {
                            const orderItem = new OrderItem();
                            (orderItem.quantity = req.body[i].qty),
                            (orderItem.paid_price = req.body[i].rate),
                            (orderItem.code = req.body[i].code),
                            (orderItem.created_at = date),
                            (orderItem.medicento_name = req.body[i].medicento_name),
                            (orderItem.company_name = req.body[i].company_name),
                            (orderItem.total_amount = req.body[i].cost);
                            orderItem.save();
                            orders.push(orderItem._id);
                            csv +=
                                salesP.user.useremail +
                                "," +
                                req.body[i].code +
                                "," +
                                req.body[i].medicento_name +
                                "," +
                                req.body[i].qty +
                                "\n";
                            message +=
                                '<tr><td style="width:60%">' +
                                req.body[i].medicento_name +
                                '</td><td style="width:20%">' +
                                req.body[i].code +
                                '</td><td style="width:10%">' +
                                req.body[i].qty +
                                '</td><td style="width:10%">' +
                                req.body[i].cost +
                                "</td></tr>";
                        }
                        const order = new Order();
                        order.created_at = date;
                        order.pharmacy_id = req.body[0].pharma_id;
                        order.sales_person_id = req.body[0].salesperson_id;
                        order.sales_order_code = doc_order_code.code;
                        order.grand_total = total;
                        order.delivery_date = deliverdate;
                        order.status = "Active";
                        for (i = 0; i < count; i++) {
                            order.order_items.push(orders[i]);
                        }
                        order.save();
                        console.log(order);
                        OrderCode.findByIdAndUpdate(doc_order_code._id, {
                            $set: {
                                code: doc_order_code.code + 1
                            }
                        }, {
                            new: true
                        }, (err, update) => {});
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
                               */
                        /*var nodemailer = require('nodemailer');
 /*   const mailOptions = {
	    from: 'giteshmedicento@gmail.com', // sender address
	    to: 'giteshshastri100@gmail.com', // list of receivers
	    html: message + '<p>Grand Total = ' + total +'</p>'// plain text body
    };
    */
                        console.log(csv);
                        Person.findOne({
                                _id: req.body[0].salesperson_id
                            })
                            .populate("user")
                            .exec()
                            .then(sales => {
                                content =
                                    "Order has been placed by " +
                                    docp.pharma_name +
                                    " on " +
                                    date.toISOString(); // Subject line
                                message =
                                    message +
                                    '<td style="width:60%"></td><td colspan="2" style="width:40%">Grand Total = ' +
                                    total +
                                    "</td>";
                                nodeoutlook.sendEmail({
                                    auth: {
                                        user: "giteshshastri123@outlook.com",
                                        pass: "shastri@1"
                                    },
                                    from: "giteshshastri123@outlook.com",
                                    to: "giteshshastri96@gmail.com,contact.medicento@gmail.com",
                                    subject: content,
                                    html: message,
                                    attachments: [{
                                        filename: "SalesOrder_Medicento_" +
                                            docp.pharma_name +
                                            "_" +
                                            sales.user.useremail +
                                            "_" +
                                            date.toISOString() +
                                            ".csv",
                                        content: csv
                                    }]
                                });
                                console.log("Sales id : ", sales);
                                Person.update({
                                        _id: sales._id
                                    }, {
                                        Total_sales: sales.Total_sales + total,
                                        No_of_order: sales.No_of_order + 1,
                                        Earnings: sales.commission * (sales.Total_sales + total)
                                    })
                                    .exec()
                                    .then((err, updated) => {
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
                                            order_id: "" + str(order.sales_order_code),
                                            grand_total: order.grand_total
                                        });
                                    });
                            });
                    });
            });
    });
});

router.get("/csv", (req, res, next) => {
    content = "Order has been placed by "; // Subject line
    message =
        '<td style="width:60%"></td><td colspan="2" style="width:40%">Grand Total = </td>';
    nodeoutlook.sendEmail({
        auth: {
            user: "giteshshastri123@outlook.com",
            pass: "shastri@1"
        },
        from: "giteshshastri123@outlook.com",
        to: "giteshshastri96@gmail.com",
        subject: content,
        html: message,
        attachments: [{
            filename: "attachment.csv",
            content: "bs, bs, bs, bs \n vs, vs, vs, vs"
        }]
    });
    res.send("Hie");
});

router.get("/order", (req, res, next) => {
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
            });
        });
});

router.post("/inventory", (req, res) => {
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
        });
    });
});

router.post("/inventoryProduct", (req, res) => {
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
        });
    });
});

router.get("/inventoryProductc", (req, res) => {
    InventoryProduct.Update({
            product_name: req.body.proname
        }, {
            $set: {
                stock_left: req.body.stock,
                cost_for_medicento: req.body.price,
                price_to_seller: req.body.price,
                price_to_retailer: req.body.price
            }
        },
        function (err, doc) {
            res.status(200).json({
                doc: doc
            });
        }
    );
});

router.post("/details", (req, res) => {
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

router.post("/medimap", (req, res) => {
    const productandmedi = new ProductAndMedi({
        product_id: req.body.product_id,
        inventory_product_id: req.body.inventory_product_id
    });
    productandmedi.save().then(result => {
        res.status(201).json({
            productandmedi: result
        });
    });
});

module.exports = router;