//Library Imports

//For Upload File...
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

//Library Imports
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb');

//Local Imports
var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

app.post('/profile', upload.single('avatar'), function (req, res, next) {
    console.log('Uploaded Successfully...');
    res.status(200).send();
    next();
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
})

//POST Users...
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password', 'phoneno', 'address']);
    var user = new User(body);

    user.save().then((user) => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    })
});

//Authenticate User By Credentials...
app.post('/users/LG', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        res.header('x-auth', user.tokens[0].token).send(user);
        console.log(user);
        res.send(user).catch((err) => {
            res.status(400).send();
        });
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});
