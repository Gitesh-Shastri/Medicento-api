const mongoose = require('mongoose');
const express= require('express');
const router = express.Router();
const User = require('../models/user');

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