// Library calls...
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    phoneNo: {
        type: Number,
        maxlength: 14
    },
    address: {
        type: String
    },
    path: {
        type: String
    },
    email: {
        required: true,
        type: String,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        },
        access: {
            type: String,
            required: true
        }
    }]
});

/*UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};*/

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({token, access});
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
                 bcrypt.compare(password, user.password).then((result) => {
                    if(result){
                        resolve(user);
                    }
                    reject();
        });
        });
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.updateOne({
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.statics.findByToken = function (token) {
    var user = this;
    var decoded;

    try{
        decoded = jwt.verify(token, 'abc123');
    }catch(err){
        return Promise.reject();
    }

    return user.findOne({
        _id: decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });  
};

UserSchema.pre('save', function (next) {
    var user = this;

    //Check whether the password is modified...
    if (user.isModified('password'))
    {
        //Generate Salt and Hash Password...
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                console.log("Hash of Password: ", hash);
                next();
            });
        });
    }
    else{
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User}