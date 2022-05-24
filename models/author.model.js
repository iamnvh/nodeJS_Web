const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const authorSchema = new Schema({
    name: {type: 'string', required: true},
  },{collection: 'authors', timestamps: true});


module.exports = mongoose.model('categories',authorSchema);