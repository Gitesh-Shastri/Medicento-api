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

router.get('/salesLogin', (req, res, next) => {
    console.log(req.query);
    User.find({
            useremail: req.query.email,
            password: req.query.password
        })
        .exec()
        .then(user => {
            console.log(user);
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({
                message: "Invalid Useremail or password"
            });
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