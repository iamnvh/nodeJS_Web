const Category_Model = require('../../models/category.model')
const Product_Model = require('../../models/book.model')
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class HomeController {
  async index(req, res) {
    try {
      const [category,hotdeal,productnew] = await Promise.all([
        Category_Model.find({}),
        Product_Model.find({}).sort({discount: -1}).limit(8),
        Product_Model.find({}).sort({createdAt: -1}).limit(8),
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
      const id = req.params.id;
      console.log('id', id)
      const pageNumber = req.query.page;
      const perPage = 5;
      const [product,totalProduct] = await Promise.all([
        Product_Model.find({categories: id}).skip((pageNumber - 1) * perPage),
        Product_Model.countDocuments()
      ])
      console.log(product)
      const pages = [];
      const totalPages = Math.ceil(totalProduct / perPage);
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return res.render('./frontend/shop', {
        datas: mutipleMongooseToObject(product)
      })
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new HomeController;