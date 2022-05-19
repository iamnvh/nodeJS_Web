const User_Model = require('../../models/user.model')
const Category_Model = require('../../models/category.model')
const Order_Model = require('../../models/order.model')
const Cart_Model = require('../../models/cart.model')
const { verifyToken } = require('../../utli/verifyToken');
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class AccController {
  async index(req, res) {
    if (req.cookies.tokenUser) {
      const decodedToken = await verifyToken(req.cookies.tokenUser)
      const cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (cart == null) {
        res.locals.giohang = ""
      } else {
        res.locals.giohang = (mutipleMongooseToObject(cart.products) ? mutipleMongooseToObject(cart.products) : "")
      }
      res.locals.giohang1 = cart
    }
    const decodedToken = await verifyToken(req.cookies.tokenUser)
    const category = await Category_Model.find({});
    res.locals.danhmuc = mutipleMongooseToObject(category)
    const user = await User_Model.findOne({ _id: decodedToken.id });
    const order = await Order_Model.find({ user_id: decodedToken.id });
    console.log(order);
    return res.render('./frontend/my-acc.pug', {
      datas: user,
      orders: order
    })
  }
  async confirm(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.tokenUser);
      const order = await Order_Model.find({ user_id: decodedToken.id })
      if (order) {
        await Order_Model.updateOne({ _id: req.params.id }, { status: '2' })
        return res.redirect("/account")
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new AccController;