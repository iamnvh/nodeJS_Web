const Product_Model = require('../../models/book.model')
const Category_Model = require('../../models/category.model')
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class ProductController {
  async index(req, res) {
    try {
      const pageNumber = req.query.page || 1;
      const perPage = 5;
      const [products, totalProducts] = await Promise.all([
        Product_Model.find().limit(perPage).skip((pageNumber - 1)* perPage).populate({path: 'categories'}),
        Product_Model.countDocuments()
      ]);

      return res.render('./backend/product/list-product',{
        datas: mutipleMongooseToObject(products),
        current: pageNumber,
        pages: Math.ceil(totalProducts / perPage),
      })
    } catch (error) {
      throw error;
    }
  }
  async creat(req, res) {
    try {
      const category = await Category_Model.find({});
      return res.render('./backend/product/add-product',{
        category: mutipleMongooseToObject(category)
      })
    } catch (error) {
      throw error;
    }
  }
  async store(req, res) {
    try {
      await Product_Model.create({
        name: req.body.book,
        supplier: req.body.supplier,
        publishingcompany: req.body.publishingcompany,
        publishingyear: req.body.publishingyear,
        author: req.body.author,
        numberofpages: req.body.numberofpages,
        amount: req.body.amount,
        price: req.body.price,
        discount: req.body.discount,
        bookdetails: req.body.bookdetails,
        photo: req.file.filename,
        categories: req.body.category_id,
      })
      return res.redirect('/admin/product/')
    } catch (error) {
      throw error;
    }
  }
  async details(req, res) {
    try {
      const data = await Product_Model.findById(req.params.id).populate({path: 'categories'})
      return res.render('./backend/product/details-product', {
        datas: mongooseToObject(data)
      })
    } catch (error) {
      throw error;
    }
  }
  async edit(req, res) {
    try {
      const [product, category] = await Promise.all([
        Product_Model.findById(req.params.id).populate({path: 'categories'}),
        Category_Model.find({})
      ])
      return res.render('./backend/product/update-product', {
        datas: mongooseToObject(product),
        category: mutipleMongooseToObject(category)
      })
    } catch (error) {
      throw error;
    }
  }
  async update(req, res) {
    try {
      let data;
      if(req.file) {
        data = {
          name: req.body.book,
          supplier: req.body.supplier,
          publishingcompany: req.body.publishingcompany,
          publishingyear: req.body.publishingyear,
          author: req.body.author,
          numberofpages: req.body.numberofpages,
          amount: req.body.amount,
          price: req.body.price,
          discount: req.body.discount,
          bookdetails: req.body.bookdetails,
          photo: req.file.filename,
          categories: req.body.category_id,
        }
      } else {
        data = {
          name: req.body.book,
          supplier: req.body.supplier,
          publishingcompany: req.body.publishingcompany,
          publishingyear: req.body.publishingyear,
          author: req.body.author,
          numberofpages: req.body.numberofpages,
          amount: req.body.amount,
          price: req.body.price,
          discount: req.body.discount,
          bookdetails: req.body.bookdetails,
          categories: req.body.category_id,
        }
      }
      console.log(data)
      await Product_Model.updateOne({_id: req.params.id}, data)
      return res.redirect('/admin/product');
    } catch (error) {
      throw error;
    }
  }
  async delete(req, res) {
    try {
      await Product_Model.deleteOne({_id: req.params.id})
      return res.redirect('/admin/product');
    } catch (error) {
      throw error;
    }
  }
}

  
module.exports = new ProductController;