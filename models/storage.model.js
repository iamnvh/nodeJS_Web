const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storageSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  products: [{
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products'
    },
    quantity: {
      type: 'number'
    },
    name: {
      type: 'string'
    },
    photo: {
      type: 'string'
    },
    price: {
      type: 'number'
    },
    discount: {
      type: 'number'
    }
  }],
  totalPrice: {
    type: 'number'
  },
  name: {
    type: 'string'
  },
  address: {
    type: 'string'
  },
  phone: {
    type: 'number'
  },
  status: {
    type: 'string'
  },
  date: {
    type: 'string'
  }
}, {
  collection: 'stores',
  timestamps: true
});

module.exports = mongoose.model('stores', storageSchema);