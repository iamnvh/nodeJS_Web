const Category_Model = require('../../models/category.model')
const Product_Model = require('../../models/book.model')
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class ProductDetailController {
  async index(req, res) {
    const id = req.params.id;
    const product = await Product_Model.findById(id)
    console.log(product)
    return res.render('./frontend/productdetail', {
      datas: mongooseToObject(product)
    })
  }
}

module.exports = new ProductDetailController;