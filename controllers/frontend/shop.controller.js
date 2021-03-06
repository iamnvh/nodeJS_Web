const Category_Model = require('../../models/category.model')
const Product_Model = require('../../models/book.model')
const { escapeRegex } = require('../../utli/escapeRegex');
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class ShopListController {
  async index(req, res) {
    try {
      const pageNumber = req.query.page || 1;
      const perPage = 9;
      const [category,product,totalProduct] = await Promise.all([
        Category_Model.find({}),
        Product_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
        Product_Model.countDocuments()
      ])
      res.locals.danhmuc =  mutipleMongooseToObject(category)
      const search = req.query.search
      if (search) {
        const findName = await Product_Model.find({name: new RegExp(escapeRegex(search), 'gi')})
        return res.render('./frontend/shop',{
          datas: mutipleMongooseToObject(findName),
          current: pageNumber,
          pages: Math.ceil(totalProduct / perPage),
        })
      } else {
        return res.render('./frontend/shop',{
          datas: mutipleMongooseToObject(product),
          current: pageNumber,
          pages: Math.ceil(totalProduct / perPage),
        })
      }
    } catch (error) {
      throw error;
    }
  }
  
  
}

module.exports = new ShopListController;