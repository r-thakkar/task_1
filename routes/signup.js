const express = require('express');
const router = express.Router();
//Library Imports

//For Upload File...
var multer = require('multer')
var upload = multer({ dest: '../uploads/' })

//Library Imports
const _ = require('lodash');
//const express = require('express');
//const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb');

//Local Imports
var { mongoose } = require('./../db/mongoose');
var { User } = require('./../models/user');
var { authenticate } = require('./../middleware/authenticate');

//POST(Sign Up) Users...
router.post('/users', upload.single('avatar'), function (req, res, next) {
    console.log('Uploaded Successfully...');
    next();}, (req, res) => {
    var body = _.pick(req.body, ['name', 'email', 'password', 'phoneNo', 'address']);
    var user = new User(body);

    user.save().then((user) => {
        res.send(user);
    }).catch((err) => {
        res.status(400).send(err);
    })
});

module.exports = router;
