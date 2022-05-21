const Product_Model = require("../../models/book.model");
const Order_Model = require("../../models/order.model")
const { verifyToken } = require('../../utli/verifyToken');
const Storage_Model = require("../../models/storage.model")
const moment = require("moment");
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class OrderController {
  async index(req, res) {
    try {
      const pageNumber = req.query.page || 1;
      const perPage = 8;
      const [order, totalOrder] = await Promise.all([
        Order_Model.find().limit(perPage).skip((pageNumber - 1) * perPage),
        Order_Model.countDocuments()
      ]);
      return res.render('./backend/order/list-order', {
        datas: mutipleMongooseToObject(order),
        current: pageNumber,
        pages: Math.ceil(totalOrder / perPage),
      })
    } catch (error) {
      throw error;
    }
  }
  async confirm(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.tokenAdmin);
      const admin = await Admin_Model.findOne({ _id: decodedToken.id });
      if (admin) {
        await Order_Model.updateOne({ _id: req.params.id }, { status: '1' })
        return res.redirect("/admin/order")
      }
    } catch (error) {
      console.log(error);
    }
  }
  async delete(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.tokenAdmin);
      const admin = await Admin_Model.findOne({ _id: decodedToken.id });
      if (admin) {
        const order = await Order_Model.find({_id: req.params.id})
        await Storage_Model.create({
          user_id: order[0].user_id,
          products: order[0].products,
          totalPrice: order[0].totalPrice,
          name: order[0].name,
          address: order[0].address,
          phone: order[0].phone,
          status: order[0].status,
          date: moment(new Date()).format('YYYY-MM-DD'),
        })
        await Order_Model.deleteOne({ _id: req.params.id })
      }
      return res.redirect('/admin/order')
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new OrderController();