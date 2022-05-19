const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'products'
  },
  name: {
      type: 'string',
  },
  review: {
    type: 'string',
  }
}, {
  collection: 'reviews',
  timestamps: true,
});

module.exports = mongoose.model('reviews', reviewSchema);