const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {type: 'string', required: true},
    email: {type: 'string', required: true},
    password: {type: 'string', required: true},
    role: {type: 'string', required: true},
},{collection: 'admins', timestamps: true});

module.exports = mongoose.model('admins',adminSchema)