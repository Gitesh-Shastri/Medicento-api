const Product = require('../models/Product');
const OrderCode = require('../models/sales_order_code');
const Delivery = require('../models/deliveryPerson');
const Pharmacy = require('../models/pharmacy');
const Review = require('../models/review');
const Person = require('../models/sperson');
const InventoryProduct = require('../models/InventoryProduct');
const ProductAndMedi = require('../models/productandmedi');
const Inventory = require('../models/Inventory');
const OrderItem = require('../models/SalesOrderItem');
const fs = require('fs');
const Order = require('../models/SalesOrder');
const Log = require('../models/logs');
const mongoose = require('mongoose');
const areadelivery = require('../models/area_and_delivery');
const express = require('express');
const Jobs = require('../models/jobs');
const DeliveryJobs = require('../models/delivery_jobs');
const router = express.Router();
const moment = require('moment');
const OfferInventory = require('../models/offermedicine');
const Camp = require('../models/camp');
const fast_csv = require('fast-csv');
const vpiinventory = require('../models/vpimedicine');
const tulsiinverntory = require('../models/tulsimedicines');
const SalesAppUser = require('../models/SalesAppUser');
var nodeoutlook = require('nodejs-nodemailer-outlook');

const DeliveryController = require('../controllers/delivery');

var statedict = [];
statedict['Andaman And Nicobar Islands'] = 'AN';
statedict['Andhra Pradesh'] = 'AP';
statedict['Arunachal Pradesh'] = 'AP';
statedict['Assam'] = 'AP';
statedict['Bihar'] = 'AP';
statedict['Dadra And Nagar Haveli'] = 'AP';
statedict['Delhi'] = 'AP';
statedict['Goa'] = 'GA';
statedict['Gujarat'] = 'GJ';

router.get('/delivery', DeliveryController.get_delivery_person_detals_by_id);

router.get('/delivery/profile', DeliveryController.get_delivery_person_profile_by_id);

router.get('/delivery/login', DeliveryController.delivery_person_login);

router.post('/delivery/update_password', DeliveryController.change_delivery_person_password);

router.get('/delivery/distributor_orders', (req, res, next) => {
	if (req.query.distributor_name == 'tulsi') {
		Order.find({})
			.populate('order_items medicento_name quantity total_amount')
			.populate('pharmacy_id pharma_name')
			.exec()
			.then((orders) => {
				const response = {
					orders: orders.map((doc) => {
						return {
							distributor: 'Tulsi',
							Slot: doc.order_slot,
							Pharmacy_Name: doc.pharmacy_id.pharma_name,
							medicento_list: doc.order_items,
							order_id: doc.sales_order_code
						};
					})
				};
				res.status(200).json({ message: 'Found Pending Orders', order: response });
			})
			.catch((err) => {
				res.status(200).json({ message: 'No Orders Pending' });
			});
	} else {
		res.status(200).json({ message: 'No Orders Pending' });
	}
});

router.get('/pharmacy_details', (req, res, next) => {
	Person.find()
		.populate('Allocated_Pharma')
		.populate('Allocated_Area')
		.populate('user')
		.exec()
		.then((doc) => {
			let csv =
				'pharma_name, pharma_address, gst_license, drug_license ,email, contact, owner_name, pan_card, created_at, state, city , area, pharma_code, No_of_order \n';
			doc.forEach((person_contact) => {
				if (person_contact.Allocated_Pharma == null) {
					csv += ',,,,,,,,,';
				} else {
					csv +=
						person_contact.Allocated_Pharma.pharma_name +
						',' +
						person_contact.Allocated_Pharma.pharma_address +
						',' +
						person_contact.Allocated_Pharma.gst_license +
						',' +
						person_contact.Allocated_Pharma.drug_license +
						',' +
						person_contact.Allocated_Pharma.gst_license +
						',' +
						person_contact.Allocated_Pharma.email +
						',' +
						person_contact.Allocated_Pharma.contact +
						',' +
						person_contact.Allocated_Pharma.owner_name +
						',' +
						person_contact.Allocated_Pharma.pan_card +
						',' +
						person_contact.Allocated_Pharma.created_at +
						',';
				}
				if (person_contact.Allocated_Area == null) {
					csv += ',,,';
				} else {
					csv +=
						person_contact.Allocated_Area.area_state +
						',' +
						person_contact.Allocated_Area.area_city +
						',' +
						person_contact.Allocated_Area.area_name +
						',';
				}
				if (person_contact.user == null) {
				} else {
					csv += person_contact.user.usercode;
				}
				csv += ',' + person_contact.No_of_order + '\n';
			});
			nodeoutlook.sendEmail({
				auth: {
					user: 'Team.medicento@outlook.com',
					pass: 'med4lyf@51'
				},
				from: 'Team.medicento@outlook.com',
				to: 'giteshshastri96@gmail.com',
				subject: 'Retailer Details Dump',
				attachments: [
					{
						filename: 'Retailer_Details' + '.csv',
						content: csv
					}
				]
			});
		})
		.catch((err) => {
			res.status(200).json({ err: err });
		});
});

router.get('/delivery/distributor_orders_csv', (req, res, next) => {
	Order.find({})
		.populate('order_items medicento_name quantity total_amount')
		.populate('pharmacy_id pharma_name')
		.exec()
		.then((orders) => {
			let csv = 'Order_id, Pharmacy_name, Date, Medicine_Name, Quantity, Price \n';

			orders.forEach((order) => {
				csv += order.sales_order_code + ',';
				csv += order.pharmacy_id.pharma_name + ',';
				csv += order.created_at + ',';
				if (order.order_items.length > 0) {
					csv += order.order_items[0].medicento_name + ',';
					csv += order.order_items[0].quantity + ',';
					csv += order.order_items[0].paid_price + ',';
				}
				if (order.order_items.length > 1) {
					csv += '\n';
					for (let i = 1; i < order.order_items.length; i++) {
						csv += ',,,';
						csv += order.order_items[i].medicento_name + ',';
						csv += order.order_items[i].quantity + ',';
						csv += order.order_items[i].paid_price + '\n';
					}
				}
				csv += '\n';
			});
			nodeoutlook.sendEmail({
				auth: {
					user: 'Team.medicento@outlook.com',
					pass: 'med4lyf@51'
				},
				from: 'Team.medicento@outlook.com',
				to: 'giteshshastri96@gmail.com',
				subject: 'Sales Order Dump',
				attachments: [
					{
						filename: 'SalesOrder_Medicento_Dump' + '.csv',
						content: csv
					}
				]
			});
		})
		.catch((err) => {
			res.status(200).json({ message: 'No Orders Pending' });
		});
});

router.get('/statedict', (req, res, next) => {
	res.status(200).json(statedict['Gujarat']);
});

router.post('/orderCode', (req, res, next) => {
	const order = new OrderCode();
	order.code = 10000000;
	order.save();
	res.status(200).json({
		order_code: order
	});
});

router.get('/jobs', DeliveryController.get_delivery_jobs_by_id);

router.post('/jobs', DeliveryController.create_new_delivery_jobs);

router.get('/delivery_jobs', DeliveryController.get_delivery_person_jobs_by_id);

router.post('/delivery_jobs', DeliveryController.create_new_delivery_jobs);

router.post('/ch', (req, res, next) => {
	InventoryProduct.findOneAndUpdate(
		{
			product_name: req.body.name
		},
		{
			$set: {
				stock_left: req.body.stock
			}
		},
		{
			new: true
		}
	)
		.exec()
		.then((doc, err) => {
			if (err) {
				res.send(err);
			}
			res.send(doc);
		});
});

router.post('/feedback', (req, res, next) => {
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

router.get('/offer', (req, res, next) => {
	OfferInventory.find()
		.sort({ Item_name: 1 })
		.select('Item_name manfc_name mrp qty')
		.exec()
		.then((docs) => {
			if (docs.length > 0) {
				const response = {
					count: docs.length,
					products: docs.map((doc) => {
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
					message: 'Offer Available',
					offermedicine: response
				});
			}
			res.status(200).json({
				message: 'Offer Not Available'
			});
		})
		.catch((err) => {
			res.status(400).json({
				message: 'Offer Not Available'
			});
		});
});

router.post('/offer', (req, res, next) => {
	var vpi = new OfferInventory();
	vpi.Item_name = '-';
	vpi.batch_no = '-';
	vpi.expiry_date = '-';
	vpi.qty = 0;
	vpi.packing = '-';
	vpi.item_code = '-';
	vpi.mrp = 0;
	vpi.manfc_code = '-';
	vpi.manfc_name = '-';
	vpi.save();
	console.log(vpi);
});

router.get('/medi', (req, res) => {
	count = req.body.length;
	a = 0;
	for (i = 0; i < count; i++) {
		const inventoryProduct = new InventoryProduct();
		inventoryProduct.inventory_product_id = new mongoose.Types.ObjectId();
		inventoryProduct.inventory_id = '5b2e2e31f739e00600387bdf';
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

router.get('/medimap', (req, res) => {
	vpiinventory
		.find({ distributor: 'parshva' })
		.sort({ Item_name: 1 })
		.select('Item_name manfc_name mrp qty item_code packing discount offer_qty')
		.exec()
		.then((docs) => {
			const response = {
				count: docs.length,
				products: docs.map((doc) => {
					return {
						medicento_name: doc.Item_name,
						company_name: doc.manfc_name,
						price: doc.mrp,
						stock: doc.qty,
						item_code: doc.item_code,
						_id: doc._id,
						packing: doc.packing,
						discount: doc.discount,
						offer_qty: doc.offer_qty
					};
				})
			};
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});
router.get('/recent_order/:id', (req, res, next) => {
	Order.find({
		pharmacy_id: req.params.id
	})
		.select('created_at grand_total sales_order_code status')
		.populate('order_items')
		.exec()
		.then((docs) => {
			const response = {
				orders: docs.map((doc) => {
					return {
						order_id: doc.sales_order_code,
						created_at: doc.created_at,
						grand_total: doc.grand_total,
						status: doc.status,
						order_items: doc.order_items
					};
				})
			};
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
});

router.get('/notification', (req, res, next) => {
	Camp.find()
		.exec()
		.then((doc) => {
			var doc1 = doc[doc.length - 1];
			res.status(200).json({
				title: doc1.name,
				type: doc1.type,
				content: doc1.content
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
});

router.post('/delivery/area_and_deliveryC', (req, res, next) => {
	Delivery.findOne({
		_id: req.query.id
	})
		.populate('area_and_delivery')
		.exec()
		.then((doc) => {
			console.log(doc);
			for (i = 0; i < doc.area_and_delivery.length; i++) {
				if (doc.area_and_delivery[i].area == '5b28cf4a4381b00448fcbb27') {
					areadelivery
						.findByIdAndUpdate(
							{
								_id: doc.area_and_delivery[i]._id
							},
							{
								$set: {
									No_of_delivery: doc.area_and_delivery[i].No_of_delivery + 1
								}
							},
							{
								new: true
							}
						)
						.exec()
						.then((doc1) => {
							res.send(doc1);
						});
				} else {
					res.send('fsdkkmf.,');
				}
			}
		});
});

router.post('/delivery', (req, res, next) => {
	const delivery = new Delivery(req.body)
		.save()
		.then((doc) => {
			console.log(doc);
			res.status(201).json({
				doc: doc
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				err: err
			});
		});
});

router.get('/date', (req, res, next) => {
	var date = new Date();
	res.status(200).json(moment().format('DD-MMM-YYYY'));
});

router.post('/neworder', (req, res, next) => {
	const log = new Log();
	log.logd = JSON.stringify(req.body);
	log.created_at = new Date();
	log.save();
	var csv = 'Party_Code, Item_Code, Item_Name, Qty\n';
	var txt = '';
	var date = new Date();
	OrderCode.find()
		.exec()
		.then((doc_order_code) => {
			Person.findById(req.body[0].salesperson_id)
				.populate('Allocated_Pharma')
				.populate('Allocated_Area')
				.populate('user')
				.exec()
				.then((sperson) => {
					message =
						'<h3>Pharmacy Name: ' +
						sperson.Allocated_Pharma.pharma_name +
						'</h4><h4>Address : ' +
						sperson.Allocated_Pharma.pharma_address +
						'</h4>' +
						'<h4>' +
						'Source : ' +
						req.body[0].source +
						'</h4>';
					'<h4>Chosen Slot : ' + req.body[0].slot + '</h4>';
					message +=
						'<table width="100%" style="border-collapse: collapse;"><tr style="background-color: #1F3864;color:white;text-align:center"><th style="border: 1px solid black;padding: 8px;text-align:center;width:60%;">Item_Name</th><th style="border: 1px solid black;padding: 8px;text-align:centerwidth:20%;">Item_Code</th><th style="border: 1px solid black;padding: 8px;text-align:center;width:10%">Quantity</th><th style="border: 1px solid black;padding: 8px;text-align:centerwidth:10%">Cost</th></tr>';
					var deliverdate = date;
					deliverdate.setDate(deliverdate.getDate() + 1);
					deliverdate = deliverdate.toLocaleDateString();
					count = req.body.length - 1;
					total = 0;
					orderid = '';
					for (i = 0; i < count; i++) {
						cost = Number(req.body[i].cost);
						total += cost;
					}
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
							sperson.Allocated_Pharma.distributor_Code +
							',' +
							req.body[i].code +
							',' +
							req.body[i].medicento_name +
							',' +
							req.body[i].qty +
							'\n';
						message +=
							'<tr><td style="border: 1px solid black;padding: 8px;text-align:center;width:60%">' +
							req.body[i].medicento_name +
							'</td><td style="border: 1px solid black;padding: 8px;text-align:center;width:20%">' +
							req.body[i].code +
							'</td><td style="border: 1px solid black;padding: 8px;text-align:center;width:10%">' +
							req.body[i].qty +
							'</td><td style="border: 1px solid black;padding: 8px;text-align:center;width:10%">' +
							req.body[i].cost +
							'</td></tr>';
						txt +=
							doc_order_code[0].code +
							'|' +
							moment().format('DD-MMM-YYYY') +
							'|' +
							sperson.Allocated_Pharma.distributor_Code +
							'|' +
							sperson.Allocated_Pharma.pharma_name +
							'|0' +
							req.body[i].code +
							'|' +
							req.body[i].medicento_name +
							'||' +
							req.body[i].qty +
							'|0|0|' +
							req.body[i].rate +
							'|' +
							req.body[i].mrp +
							'\n';
					}
					console.log(doc_order_code[0].code);
					const order = new Order();
					order.created_at = date;
					order.source = req.body[0].source;
					order.order_slot = req.body[0].slot;
					order.pharmacy_id = req.body[0].pharma_id;
					order.sales_person_id = req.body[0].salesperson_id;
					order.sales_order_code = doc_order_code[0].code;
					order.grand_total = total;
					order.delivery_date = deliverdate;
					order.status = 'Active';
					for (i = 0; i < count; i++) {
						order.order_items.push(orders[i]);
					}
					order.save();
					console.log(order);
					doc_order_code[0].code = doc_order_code[0].code + 1;
					doc_order_code[0].save();
					content =
						'Order has been placed by ' +
						sperson.Allocated_Pharma.pharma_name +
						' on ' +
						date.toISOString(); // Subject line
					message =
						message +
						'<td style="width:60%"></td><td colspan="2" style="width:40%">Grand Total = ' +
						total +
						'</td>';
					nodeoutlook.sendEmail({
						auth: {
							user: 'Team.medicento@outlook.com',
							pass: 'med4lyf@51'
						},
						from: 'Team.medicento@outlook.com',
						to: 'giteshshastri96@gmail.com,sale.medicento@gmail.com',
						subject: content,
						html: message,
						attachments: [
							{
								filename:
									'SalesOrder_Medicento_' +
									sperson.Allocated_Pharma.pharma_name +
									'_' +
									sperson.user.useremail +
									'_' +
									date.toISOString() +
									'.csv',
								content: csv
							},
							{
								filename:
									'SalesOrder_Medicento_' +
									sperson.Allocated_Pharma.pharma_name +
									'_' +
									sperson.user.useremail +
									'_' +
									date.toISOString() +
									'.txt',
								content: txt
							}
						]
					});
					Person.update(
						{
							_id: sperson._id
						},
						{
							Total_sales: sperson.Total_sales + total,
							No_of_order: sperson.No_of_order + 1,
							Earnings: sperson.commission * (sperson.Total_sales + total)
						}
					)
						.exec()
						.then((err, updated) => {
							res.status(200).json({
								message: 'Order has been placed successfully',
								delivery_date: order.delivery_date.toLocaleString(),
								order_id: '' + order.sales_order_code,
								grand_total: order.grand_total
							});
						});
				})
				.catch((err) => {
					console.log(err);
					res.status(200).json({
						message: 'Something Went Wrong Please Try Again!!'
					});
				});
		})
		.catch((err) => {
			console.log(err);
			res.status(200).json({
				message: 'Something Went Wrong Please Try Again!!'
			});
		});
});

router.post('/order', (req, res, next) => {
	const log = new Log();
	log.logd = JSON.stringify(req.body);
	log.created_at = new Date();
	log.save();
	var csv = 'Party_Code, Item_Code, Item_Name, Qty\n';
	var date = new Date();
	console.log(date.toISOString());
	OrderCode.find()
		.exec()
		.then((doc_order_code) => {
			Pharmacy.findOne({
				_id: req.body[0].pharma_id
			})
				.populate('area')
				.exec()
				.then((docp) => {
					message =
						'<h3>Pharmacy Name: ' +
						docp.pharma_name +
						'</h4><h4>Address : ' +
						docp.pharma_address +
						'</h4>' +
						'<h4>Chosen Slot : ' +
						req.body[0].slot +
						'</h4>';
					message +=
						'<table border="1" style="width:100%"><tr><th style="width:60%">Item_Name</th><th style="width:20%">Item_Code</th><th style="width:10%">Quantity</th><th style="width:10%">Cost</th></tr>';
					var deliverdate = date;
					deliverdate.setDate(deliverdate.getDate() + 1);
					deliverdate = deliverdate.toLocaleDateString();
					count = req.body.length - 1;
					total = 0;
					orderid = '';
					for (i = 0; i < count; i++) {
						cost = Number(req.body[i].cost);
						total += cost;
					}
					Person.findOne({
						_id: req.body[0].salesperson_id
					})
						.populate()
						.exec()
						.then((salesP) => {
							(salesP.Total_sales = salesP.Total_sales + total),
								(salesP.No_of_order = salesP.No_of_order + 1),
								(salesP.Earnings = salesP.commission * (salesP.Total_sales + total));
							salesP.save();
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
									docp.distributor_Code +
									',' +
									req.body[i].code +
									',' +
									req.body[i].medicento_name +
									',' +
									req.body[i].qty +
									'\n';
								message +=
									'<tr><td style="width:60%">' +
									req.body[i].medicento_name +
									'</td><td style="width:20%">' +
									req.body[i].code +
									'</td><td style="width:10%">' +
									req.body[i].qty +
									'</td><td style="width:10%">' +
									req.body[i].cost +
									'</td></tr>';
							}
							console.log(doc_order_code[0].code);
							const order = new Order();
							order.created_at = date;
							order.order_slot = req.body[0].slot;
							order.pharmacy_id = req.body[0].pharma_id;
							order.sales_person_id = req.body[0].salesperson_id;
							order.sales_order_code = doc_order_code[0].code;
							order.grand_total = total;
							order.delivery_date = deliverdate;
							order.status = 'Active';
							for (i = 0; i < count; i++) {
								order.order_items.push(orders[i]);
							}
							order.save();
							console.log(order);
							doc_order_code[0].code = doc_order_code[0].code + 1;
							doc_order_code[0].save();
							console.log(csv);
							content = 'Order has been placed by ' + docp.pharma_name + ' on ' + date.toISOString(); // Subject line
							message =
								message +
								'<td style="width:60%"></td><td colspan="2" style="width:40%">Grand Total = ' +
								total +
								'</td>';
							nodeoutlook.sendEmail({
								auth: {
									user: 'Team.medicento@outlook.com',
									pass: 'med4lyf@51'
								},
								from: 'Team.medicento@outlook.com',
								to: 'giteshshastri96@gmail.com,sale.medicento@gmail.com',
								subject: content,
								html: message,
								attachments: [
									{
										filename:
											'SalesOrder_Medicento_' +
											docp.pharma_name +
											'_' +
											date.toISOString() +
											'.csv',
										content: csv
									}
								]
							});
							res.status(200).json({
								message: 'Order has been placed successfully',
								delivery_date: order.delivery_date.toLocaleString(),
								order_id: '' + order.sales_order_code,
								grand_total: order.grand_total
							});
						});
				});
		})
		.catch((err) => {
			res.status(200).json({ error: err });
		});
});

router.post('/order_sales', (req, res, next) => {
	const log = new Log();
	log.logd = JSON.stringify(req.body);
	log.created_at = new Date();
	log.save();
	var csv = 'ORDER NO, CUSOMER CODE, REP, 1, N, DISC, BLACK, REP, PRODUCT CODE, S,QTY,OFFER,SCH_DISC,100,502,1\n';
	var date = new Date();
	console.log(date.toISOString());
	OrderCode.find()
		.exec()
		.then((doc_order_code) => {
			Pharmacy.findOne({
				_id: req.body[0].pharma_id
			})
				.populate('area')
				.exec()
				.then((docp) => {
					message =
						'<strong>Pharmacy Name: </strong>' +
						docp.pharma_name +
						'<br/><strong>Address : </strong>' +
						docp.pharma_address +
						'<br/><strong>Order Mode: </strong> Sales App' +
						'<br/><strong>Order ID : </strong>' +
						doc_order_code[0].code +
						'<br/><strong>Chosen Slot : </strong>' +
						req.body[0].slot +
						'<br/><br/><br/>';
					message +=
						'<table border="1" style="width:100%"><tr><th style="width:60%">Item_Name</th><th style="width:20%">Item_Code</th><th style="width:10%">Quantity</th><th style="width:10%">Cost</th></tr>';
					var deliverdate = date;
					deliverdate.setDate(deliverdate.getDate() + 1);
					deliverdate = deliverdate.toLocaleDateString();
					count = req.body.length - 1;
					total = 0;
					orderid = '';
					for (i = 0; i < count; i++) {
						cost = Number(req.body[i].cost);
						total += cost;
					}
					SalesAppUser.findOne({
						_id: req.body[0].salesperson_id
					})
						.populate()
						.exec()
						.then((salesP) => {
							(salesP.Total_sales = salesP.Total_sales + total),
								(salesP.No_of_order = salesP.No_of_order + 1),
								(salesP.Earnings = salesP.commission * (salesP.Total_sales + total));
							salesP.save();
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
									doc_order_code[0].code +
									',' +
									docp.distributor_Code +
									',40,1,N,3,,40,' +
									req.body[i].code +
									',S,' +
									req.body[i].qty +
									',0,0,100,502,1\n';
								message +=
									'<tr><td style="width:60%">' +
									req.body[i].medicento_name +
									'</td><td style="width:20%">' +
									req.body[i].code +
									'</td><td style="width:10%">' +
									req.body[i].qty +
									'</td><td style="width:10%">' +
									req.body[i].cost +
									'</td></tr>';
							}
							console.log(doc_order_code[0].code);
							const order = new Order();
							order.created_at = date;
							order.order_slot = req.body[0].slot;
							order.pharmacy_id = req.body[0].pharma_id;
							order.sales_person_id = req.body[0].salesperson_id;
							order.sales_order_code = doc_order_code[0].code;
							order.grand_total = total;
							order.delivery_date = deliverdate;
							order.status = 'Active';
							for (i = 0; i < count; i++) {
								order.order_items.push(orders[i]);
							}
							order.save();
							console.log(order);
							doc_order_code[0].code = doc_order_code[0].code + 1;
							doc_order_code[0].save();
							console.log(csv);
							content =
								'Order has been placed by ' +
								docp.pharma_name +
								' | ' +
								'Bangalore | ' +
								moment().format('DD-MMM-YYYY HH:mm:ss'); // Subject line
							message =
								message +
								'<td style="width:60%"></td><td colspan="2" style="width:40%">Grand Total = ' +
								total +
								'</td>';
							nodeoutlook.sendEmail({
								auth: {
									user: 'Team.medicento@outlook.com',
									pass: 'med4lyf@51'
								},
								from: 'Team.medicento@outlook.com',
								to: 'giteshshastri96@gmail.com,sale.medicento@gmail.com',
								subject: content,
								html: message,
								attachments: [
									{
										filename:
											'SalesOrder_Medicento_' +
											docp.pharma_name +
											'_' +
											date.toISOString() +
											'.csv',
										content: csv
									}
								]
							});
							res.status(200).json({
								message: 'Order has been placed successfully',
								delivery_date: order.delivery_date.toLocaleString(),
								order_id: '' + order.sales_order_code,
								grand_total: order.grand_total
							});
						});
				});
		})
		.catch((err) => {
			res.status(200).json({ error: err });
		});
});

router.post('/send_mail', (req, res, next) => {
	console.log(req.body.message);
	message = req.body.message;

	nodeoutlook.sendEmail({
		auth: {
			user: 'Team.medicento@outlook.com',
			pass: 'med4lyf@51'
		},
		from: 'Team.medicento@outlook.com',
		to: 'giteshshastri96@gmail.com,sale.medicento@gmail.com',
		subject: 'Order has been placed',
		html: 'Test Mail From Django'
	});

	res.status(200).json({ message: 'mail sent' });
});

router.post('/csv', (req, res, next) => {
	SalesAppUser.findOne({
		useremail: 'medisidd',
		password: 'sidd@123'
	})
		.populate()
		.exec()
		.then((salesP) => {
			res.status(200).json({ salesP: salesP });
		})
		.catch((err) => {
			res.status(200).json({ err: err });
		});
});

router.get('/order', (req, res, next) => {
	Order.find()
		.exec()
		.then((doc) => {
			res.status(200).json({
				order: doc
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
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
	inventory.save().then((result) => {
		res.status(201).json({
			Inventory: result
		});
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
	inventoryProduct.save().then((result) => {
		res.status(201).json({
			inventoryProduct: result
		});
	});
});

router.get('/inventoryProductc', (req, res) => {
	InventoryProduct.Update(
		{
			product_name: req.body.proname
		},
		{
			$set: {
				stock_left: req.body.stock,
				cost_for_medicento: req.body.price,
				price_to_seller: req.body.price,
				price_to_retailer: req.body.price
			}
		},
		function(err, doc) {
			res.status(200).json({
				doc: doc
			});
		}
	);
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
	product.save().then((result) => {
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
	productandmedi.save().then((result) => {
		res.status(201).json({
			productandmedi: result
		});
	});
});

router.get('/fetchOrders', (req, res, next) => {
	Order.find({ sales_person_id: req.query.id })
		.populate('pharmacy_id')
		.populate('order_items')
		.exec()
		.then((doc) => {
			res.status(200).json(doc);
		})
		.catch((err) => {
			res.status(200).json(err);
		});
});

router.get('/send_mail', (req, res, next) => {});

module.exports = router;
