const mongoose = require('mongoose');

var connect = async function() {
  try {
    await mongoose.connect('mongodb://127.0.0.1/web');
    console.log('Thành Công')
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = connect