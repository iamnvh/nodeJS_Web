const Product_Model = require("../../models/book.model");
const Order_Model = require("../../models/order.model")
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class OrderController {
	async index(req, res) {
    try {
      const pageNumber = req.query.page || 1;
      const perPage = 8;
      const [order, totalOrder] = await Promise.all([
        Order_Model.find().limit(perPage).skip((pageNumber - 1)* perPage),
        Order_Model.countDocuments()
      ]);
      return res.render('./backend/order/list-order',{
        datas: mutipleMongooseToObject(order),
        current: pageNumber,
        pages: Math.ceil(totalOrder / perPage),
      })
    } catch (error) {
      throw error;
    }
	}
}

module.exports = new OrderController();
