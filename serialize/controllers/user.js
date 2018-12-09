const mongoose = require('mongoose');

const User = require('../models/user');

const Area = require('../models/area');

exports.delete_user = function (req, res, next) {
    User.findByIdAndRemove({
            _id: req.params.userId
        })
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
}

exports.create_user = function (req, res, next) {
    User.find({
            useremail: req.body.useremail
        })
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
                    password: req.body.password,
                    usercode: req.body.usercode
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

exports.find_user = function (req, res, next) {
    console.log(req.body);
    User.findOne({
            useremail: req.body.useremail
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            } else if (user.password == req.body.password) {
                return res.status(200).json({
                    message: 'Auth successful'
                });
            } else {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            });
        });
}