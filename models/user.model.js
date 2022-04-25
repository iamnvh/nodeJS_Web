const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {type: 'string', required: true},
    email: {type: 'string', required: true},
    password: {type: 'string', required: true},
    role: {type: 'string', required: true},
  },{collection: 'users', timestamp: true});



module.exports = mongoose.model('users',userSchema)