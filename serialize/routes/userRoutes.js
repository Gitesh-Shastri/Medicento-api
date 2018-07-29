const mongoose = require('mongoose');
const express= require('express');
const router = express.Router();
const User = require('../models/user');
const Area = require('../models/area');
const Person = require('../models/sperson');
const jwt = require('jsonwebtoken');

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
         
            }) });

router.get('/login', (req, res, next) => {
    User.findOne({ usercode: req.query.usercode})
        .exec()
        .then(user => {
            console.log(user);
            Person.find({user: user._id})
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
});

router.post('/login', (req, res, next) => {
    console.log(req.body);
    User.findOne({ useremail: req.body.useremail })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            } else {
                if (user.password == req.body.password) {
                    const token = jwt.sign({
                        useremail: user.useremail,
                        userId: user._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "2 days"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                } else {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/signup', (req, res, next) => {
        User.find({ useremail: req.body.useremail })
            .exec()
            .then(user => {
                if (user.length > 0) {
                    res.status(409).json({
                        message: "Mail Exists"
                    });
                } else {
                    const user = new User({
                                _id: mongoose.Types.ObjectId(),
                                useremail: req.body.useremail,
                                password: req.body.password
                            });
                            user.save()
                                .then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: "User Created !"
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                }
    });
});

router.delete('/:userId', (req, res, next) => {
        User.findByIdAndRemove({ _id: req.params.userId })
            .exec()
            .then(resut => {
                res.status(200).json({
                    message: "User Deleted"
                });  
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });

module.exports = router;
