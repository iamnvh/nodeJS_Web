const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: {type: 'string', required: true},
    supplier: {type: 'string', required: true},
    publishingcompany: {type: 'string', required: true},
    publishingyear: {type: 'number', require: true},
    author: {type: 'string', required: true},
    numberofpages: {type: 'number', require: true},
    amount: {type: 'number', require: true},
    price: {type: 'number', require: true},
    discount: {type: 'number', require: true},
    bookdetails: {type: 'string', required: true},
    photo: {type: 'string', required: true},
    categories: {type: mongoose.Schema.Types.ObjectId,
      ref: 'categories'
    }
  },{collection: 'books', timestamps: true});



module.exports = mongoose.model('books',bookSchema)