const Product_Model = require('../../models/book.model')
const Cart_Model = require('../../models/cart.model');
const Category_Model = require('../../models/category.model')
const Order_Model = require('../../models/order.model')
const { verifyToken } = require('../../utli/verifyToken');
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class CheckoutController {
  async index(req, res) {
    try {
      const category = await Category_Model.find({});
      res.locals.danhmuc =  mutipleMongooseToObject(category)
      const decodedToken = await verifyToken(req.cookies.tokenUser);
      const cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if(cart) {
        if(cart.products.length > 0)
        return res.render('./frontend/checkout', {
          datas: mutipleMongooseToObject(cart.products) ? mutipleMongooseToObject(cart.products) : {},
          cart: cart
        })
      } else {
        return res.redirect('/cart')
      }
    } catch (error) {
      console.log(error);
    }
  }
  async checkout(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.tokenUser);
      const cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (cart) {
        await Order_Model.insertMany({
          user_id: cart.user_id,
          products: cart.products,
          totalPrice: cart.totalPrice,
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone
        })
        const order = await Cart_Model.findOne({user_id: decodedToken.id});
        if (order.products.length > 0) {
          for( let i = 0; i < order.products.length; i++) {
            const amountProduct = await Product_Model.findById(order.products[i].productID)
            await Product_Model.updateOne({_id: amountProduct._id},
              {amount: amountProduct.amount - order.products[i].quantity})
          }
        }
        await Cart_Model.deleteOne({ user_id: decodedToken.id });
        return res.redirect('/')
      } else {
        return res.redirect('/cart')
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new CheckoutController;