const mongoose = require("mongoose");

const Delivery = require("../models/deliveryPerson");
const areadelivery = require("../models/area_and_delivery");

const DeliveryJobs = require("../models/delivery_jobs");

const Jobs = require("../models/jobs");
const Order = require("../models/SalesOrder");
const OrderItem = require("../models/SalesOrderItem");

exports.get_delivery_person_detals_by_id = function (req, res, next) {
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
}

exports.get_delivery_person_profile_by_id = (req, res, next) => {
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
}

exports.delivery_person_login = (req, res, next) => {
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
}

exports.change_delivery_person_password = (req, res, next) => {
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
}

exports.get_delivery_jobs_by_id = (req, res, next) => {
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
                .then(orderDoc => {
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
                            total_cost: orderDoc.grand_total,
                            no_of_items: orderDoc.order_items.length,
                            items: orderDoc.order_items
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
}

exports.create_new_delivery_jobs = (req, res, next) => {
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
}

exports.get_delivery_person_jobs_by_id = (req, res, next) => {
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
}

exports.add_delivery_jobs = (req, res, next) => {
    const delivery_jobs = new DeliveryJobs();
    delivery_jobs.delivery_person = req.body.delivery_person;
    delivery_jobs.pending_jobs.push(req.body.pending_jobs);
    delivery_jobs.completed_jobs.push(req.body.completed_jobs);
    delivery_jobs.save();
    res.status(201).json(delivery_jobs);
}