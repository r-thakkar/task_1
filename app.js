const express = require('express');
const bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json());

/*
app.post('/profile', upload.single('avatar'), function (req, res, next) {
    console.log('Uploaded Successfully...');
    res.status(200).send();
    next();
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
})
*/

var signUp = require('./routes/signup');
app.use('/', signUp);

var search = require('./routes/search');
app.use('/', search);

var login = require('./routes/login');
app.use('/', login);

var logout = require('./routes/logout');
app.use('/', logout);

//Authenticate User By Credentials...
/*
app.post('/users/LG', authenticate, (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        res.header('x-auth', user.tokens[0].token).send(user);
        //console.log(user);
        res.send(user).catch((err) => {
            res.status(400).send();
        });
    });
});

/*
app.patch('/todo1/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id))
    {
        res.status(404).send();  
    }
    if(_.isBoolean(body.completed) && body.completed)
    {
        body.completedAt = new Date().getTime();
    }
    else
    {
        body.completed = false;
        body.completedAt = null;
    }
    Todo1.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set:body}, {new: true}).then((todo) => {
    if(!todo)
    {
        res.status(404).send();		
    }
    res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});
*/


app.listen(3000, () => {
    console.log('Started on port 3000');
});
