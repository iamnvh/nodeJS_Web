const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
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
  }
}, {
  collection: 'carts',
  timestamps: true
});

module.exports = mongoose.model('carts', cartSchema);