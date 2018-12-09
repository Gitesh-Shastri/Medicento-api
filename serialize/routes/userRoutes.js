const mongoose = require('mongoose');

const express = require('express');

const router = express.Router();

const User = require('../models/user');

const Area = require('../models/area');

const Pharma = require('../models/pharmacy');

const Person = require('../models/sperson');

const jwt = require('jsonwebtoken');

const Message = require('../models/message');

const UserController = require('../controllers/user');

router.get('/message', (req, res, next) => {
    Message.find()
        .exec()
        .then(doc => {
            res.status(200).json({
                code: doc[0].code,
                count: doc[0].count
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/pharmalogin', (req, res, next) => {
    code1 = 3334;
    for (var i = 0; i < req.body.length; i++) {
        var pharma = new Pharma();
        pharma.pharma_name = req.body[i].Customer;
        pharma.area = '5b28cf4a4381b00448fcbb27';
        pharma.pharma_address = req.body[i].Address;
        pharma.save();
        var user1 = new User();
        user1.useremail = req.body[i].code;
        user1.password = req.body[i].code;
        user1.usercode = code1;
        user1.save();
        var person = new Person();
        person.user = user1._id;
        person.Name = req.body[i].Customer;
        person.Allocated_Area = '5b28cf4a4381b00448fcbb27';
        person.Allocated_Pharma = pharma._id;
        person.Total_sales = "0";
        person.No_of_order = "0";
        person.Returns = "0";
        person.Earnings = "0";
        person.save();
        code1 = code1 + 1;
    }
    res.status(200).json({
        count: req.body.length
    });
});

router.get('/remove', (req, res, next) => {
    User.find().exec().then(doc => {
        res.status(200).json(doc);
    })
});

router.post('/message', (req, res, next) => {
    const message = new Message({
        code: req.body.code,
        count: req.body.count
    }).save().then(doc => {
        res.send(doc);
    }).catch(err => {
        res.send(err);
    });
});

router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(users => {
            res.status(200).json({
                user: users
            });
        })
        .catch(err => {
            error: err
        });
});

router.get('/salesPerson', (req, res, next) => {
    Person.find()
        .exec()
        .then(users => {
            res.status(200).json({
                SalesPersons: users
            });
        })
        .catch(err => {
            error: err
        });
});

router.post('/salesPerson', (req, res, next) => {
    const person = new Person({
        _id: mongoose.Types.ObjectId(),
        user: req.body.userid,
        Name: req.body.name,
        Allocated_Area: req.body.areaid,
        Allocated_Pharma: req.body.pid,
        Total_sales: req.body.tsales,
        No_of_order: req.body.orders,
        Returns: req.body.returns,
        Earnings: req.body.earnings
    });
    person.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Sales Person Details !"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });

        })
});

router.get('/login', (req, res, next) => {
    if (req.query.useremail != null) {
        User.findOne({
                useremail: req.query.useremail
            })
            .exec()
            .then(user => {
                console.log(user);
                Person.find({
                        user: user._id
                    })
                    .exec()
                    .then(doc => {
                        res.status(200).json({
                            Sales_Person: doc
                        })
                    });
            })
            .catch(err => {
                res.status(500).json({
                    message: "Invalid Useremail or password"
                });
            });
    } else if (req.query.phone != null) {
        User.findOne({
                phone: req.query.phone
            })
            .exec()
            .then(user => {
                console.log(user);
                Person.find({
                        user: user._id
                    })
                    .exec()
                    .then(doc => {
                        res.status(200).json({
                            Sales_Person: doc
                        })
                    });
            })
            .catch(err => {
                res.status(500).json({
                    message: "Invalid Phone Number"
                });
            });
    } else {
        User.findOne({
                usercode: req.query.usercode
            })
            .exec()
            .then(user => {
                console.log(user);
                Person.find({
                        user: user._id
                    })
                    .exec()
                    .then(doc => {
                        res.status(200).json({
                            Sales_Person: doc
                        })
                    });
            })
            .catch(err => {
                res.status(500).json({
                    message: "Invalid Useremail or password"
                });
            });
    }
});

router.post('/login', UserController.find_user);

router.post('/signup', UserController.create_user);

router.delete('/:userId', UserController.delete_user);

module.exports = router;