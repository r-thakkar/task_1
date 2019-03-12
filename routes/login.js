//Library Imports
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const express = require('express');
const router = express.Router();

//Local Imports
var { mongoose } = require('./../db/mongoose');
var { User } = require('./../models/user');
var { authenticate } = require('./../middleware/authenticate');

//Authenticate User By Credentials...
router.post('/users/LG', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.save().then((user) => {
            //req.header('x-auth', token);
            return user.generateAuthToken();
        }).then((token) => {
            req.header('x-auth', token);
            res.header('x-auth', token);
            res.send("Hi, You Have Successfully logged in...\nName: " + user.name + "\nEmail: " + user.email + "\nAddress: " + user.address);
        }).catch((err) => {
            res.status(400).send(err);
        });
    });
});

module.exports = router;