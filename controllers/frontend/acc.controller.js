const User_Model = require('../../models/user.model')
const Category_Model = require('../../models/category.model')
const Order_Model = require('../../models/order.model')
const { verifyToken } = require('../../utli/verifyToken');
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class AccController {
  async index(req, res) {
    const category = await Category_Model.find({});
    res.locals.danhmuc =  mutipleMongooseToObject(category)
    const decodedToken = await verifyToken(req.cookies.tokenUser);
    const user = await User_Model.findOne({ _id: decodedToken.id });
    const order = await Order_Model.find({user_id: decodedToken.id});
    console.log(order);
    return res.render('./frontend/my-acc.pug',{
      datas: user,
      orders: order
    })
  }
}

module.exports = new AccController;