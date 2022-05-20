const Category_Model = require('../../models/category.model')
const Product_Model = require('../../models/book.model')
const Cart_Model = require('../../models/cart.model')
const { escapeRegex } = require('../../utli/escapeRegex');
const {verifyToken } = require("../../utli/verifyToken");
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class ShopListController {
  async index(req, res) {
    try {
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
      const pageNumber = req.query.page || 1;
      const perPage = 6;
      const [category,product,totalProduct] = await Promise.all([
        Category_Model.find({}),
        Product_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
        Product_Model.countDocuments()
      ])
      res.locals.danhmuc =  mutipleMongooseToObject(category)
      const search = req.query.search
      if (search) {
        const [findName, totalProduct] = await Promise.all([
          Product_Model.find({name: new RegExp(escapeRegex(search), 'gi')}).limit(perPage).skip((pageNumber - 1) * perPage),
          Product_Model.find({name: new RegExp(escapeRegex(search), 'gi')}).countDocuments()
        ])
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