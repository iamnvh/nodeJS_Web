const Product_Model = require("../../models/book.model");
const Order_Model = require("../../models/order.model");
const { verifyToken } = require("../../utli/verifyToken");
const Storage_Model = require("../../models/storage.model");
const moment = require("moment");
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../../utli/convertDataToObject");

class StatisticalController {
  async index(req, res) {
    try {
      const pageNumber = req.query.page || 1;
      const perPage = 8;
      const [order, totalOrder] = await Promise.all([
        Storage_Model.find().limit(perPage).skip((pageNumber - 1) * perPage),
        Storage_Model.countDocuments(),
      ]);
      return res.render("./backend/statistical/statistical", {
        datas: mutipleMongooseToObject(order),
        current: pageNumber,
        pages: Math.ceil(totalOrder / perPage),
      });
    } catch (error) {
      throw error;
    }
  }
	async search(req, res) {
		try {
			const pageNumber = req.query.page || 1;
      const perPage = 8;
			const date1 = moment(req.body.a).format('YYYY-MM-DD');
			const date2 = moment(req.body.b).format('YYYY-MM-DD');
			const data = await Storage_Model.find({
				date: {
					$gte: date1,
					$lte: date2
				}
			}).limit(perPage).skip((pageNumber - 1) * perPage)
			const totalPages = await Storage_Model.find({
				date: {
					$gte: date1,
					$lte: date2
				}
			})
			return res.render("./backend/statistical/statistical", {
        datas: mutipleMongooseToObject(data),
        current: pageNumber,
        pages: Math.ceil(totalPages.length / perPage),
      });
		} catch (error) {
			console.error(error)
		}
	}
}

module.exports = new StatisticalController();
