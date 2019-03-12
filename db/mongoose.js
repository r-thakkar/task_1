var mongoose = require('mongoose');

//To Connect to Database...
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp1', { useNewUrlParser: true });

module.exports = {mongoose}