//Library Imports
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

//Local Imports
var { mongoose } = require('./../db/mongoose');
var { User } = require('./../models/user');
var { authenticate } = require('./../middleware/authenticate');

//View Details of User...
router.get('/users', authenticate, (req, res) => {
    User.findOne({
        name: req.body.name
    }).then((user) => {
        var searchToken = user.tokens[0];
        var userToken = searchToken.token;
        var myToken = req.token;
        console.log("My Token: ", myToken);
        console.log("User's Token: ", userToken);
        console.log(userToken.length);
        //Both User Logged in...
        if(userToken.length > 0)
        {
             //Searching Your own Details...
            if(userToken === myToken)
            {
                console.log("Full Profile...");
                res.send(user);
            }
            //Searching Other's Details...
            else{
                console.log("Partial Profile...");
                res.send(user.name);
            }
        }
        if(userToken.length < 0)
        {
            console.log("Partial Profile...");
            res.send(user.name);
        }
        // //User Being Searched isn't Logged in...
       
    }).catch((err) => {
        res.status(400).send(err);
    });
});

module.exports = router;