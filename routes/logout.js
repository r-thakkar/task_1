//Library Imports
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const express = require('express');
const router = express.Router();

//Local Imports
var { mongoose } = require('./../db/mongoose');
var { User } = require('./../models/user');
var { authenticate } = require('./../middleware/authenticate');

//Logout the User by deleting the authentication token...
router.delete('/users/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send("You have successfully logged out...");
    }, () => {
        res.status(400).send();
    });
});

module.exports = router;