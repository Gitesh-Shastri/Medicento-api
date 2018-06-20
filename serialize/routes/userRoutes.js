const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = function (app) {
    app.get('/user', (req, res, next) => {
        User.find()
            .exec()
            .then(users => {
                res.status(200).json({
                    User: users
                });
            })
            .catch(err => {
                error: err
            });
    });
    app.post('/user/signup', (req, res, next) => {
        User.find({ useremail: req.body.useremail })
            .exec()
            .then(user => {
                if (user.length > 0) {
                    res.status(409).json({
                        message: "Mail Exists"
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            })
                        } else {
                            const user = new User({
                                _id: mongoose.Types.ObjectId(),
                                useremail: req.body.useremail,
                                password: hash
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
                }
            });
    }); 
    app.delete('/user/:userId', (req, res, next) => {
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
};