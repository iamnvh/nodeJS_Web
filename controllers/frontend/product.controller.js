const Category_Model = require('../../models/category.model')
const Product_Model = require('../../models/book.model')
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class ProductDetailController {
  async index(req, res) {
    const id = req.params.id;
    const product = await Product_Model.findById(id)
    const releaseproduct = await Product_Model.find({categories: product.categories}).limit(4)
    return res.render('./frontend/productdetail', {
      datas: mongooseToObject(product),
      datasres : mutipleMongooseToObject(releaseproduct)
    })
  }
}

module.exports = new ProductDetailController;