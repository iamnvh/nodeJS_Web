const Category_Model = require('../../models/category.model')
const Product_Model = require('../../models/book.model')
const Cart_Model = require('../../models/cart.model')
const {verifyToken } = require("../../utli/verifyToken");
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class HomeController {
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
      const [category,hotdeal,productnew] = await Promise.all([
        Category_Model.find({}),
        Product_Model.find({}).sort({discount: -1}).limit(8),
        Product_Model.find({}).sort({createdAt: -1}).limit(8)
      ])
      res.locals.danhmuc =  mutipleMongooseToObject(category)
      
      return res.render('./frontend/index', {
        hotdeal: mutipleMongooseToObject(hotdeal),
        productnew: mutipleMongooseToObject(productnew),
      })
    } catch (error) {
      throw error;
    }
  }
  async searchbyid(req, res) {
    try {
      const pageNumber = req.query.page || 1;
      const perPage = 9;
      const [category,product,totalProduct] = await Promise.all([
        Category_Model.find({}),
        Product_Model.find({categories: req.params.id}).limit(perPage).skip((pageNumber - 1) * perPage),
        Product_Model.find({categories: req.params.id})
      ])
      res.locals.danhmuc =  mutipleMongooseToObject(category)
      return res.render('./frontend/shop', {
        datas: mutipleMongooseToObject(product),
        current: pageNumber,
        pages: Math.ceil(totalProduct.length / perPage),
      })
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new HomeController;