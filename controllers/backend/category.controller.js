const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');
const Category_Model = require('../../models/category.model')
const Admin_Model = require('../../models/admin.model')
const { verifyToken } = require('../../utli/verifyToken');

class CategoryController {
    async index(req, res) {
      try {
        const decodedToken = await verifyToken(req.cookies.tokenAdmin);
        const admin = await Admin_Model.findOne({ _id: decodedToken.id });
        res.locals.admin = (admin)
        const pageNumber = req.query.page || 1;
        const perPage = 5;
        const [categories, totalCategories] = await Promise.all([
          Category_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
          Category_Model.countDocuments()
        ]);
        return res.render('./backend/category/list-category', {
          datas: mutipleMongooseToObject(categories),
          current: pageNumber,
          pages: Math.ceil(totalCategories / perPage),
        });
      } catch (error) {
        throw error;
      }
    }
    creat(req, res) {
      return res.render('./backend/category/add-category')
    }
    async store(req, res) {
      try {
        const category = await Category_Model.findOne({name: req.body.category_name});
        if(category) {
          res.render('./backend/category/add-category',{errorcategory: 'Danh mục đã tồn tại.',name: req.body.name})
        } else {
          await Category_Model.create({name: req.body.category_name});
          return res.redirect('/admin/category/')
        }
      } catch (error) {
        throw error;
      }
    }
    async edit(req, res) {
      try {
        const category = await Category_Model.findById(req.params.id);
        return res.render('./backend/category/update-category',{
          datas: mongooseToObject(category)
        })
      } catch (error) {
        throw error;
      }
    }
    async update(req, res) {
      try {
        const category = await Category_Model.findOne({name: req.body.category_name});
        if (category) {
          return res.render('./backend/category/update-category', {
            errorcategory: 'Danh mục đã tồn tại.',name: req.body.category_name,
            datas: mongooseToObject(category)
          })
        } else {
          await Category_Model.updateOne({_id: req.params.id}, {name: req.body.category_name})
          return res.redirect('/admin/category')
        }
      } catch (error) {
        throw error;
      }
    }
    async delete(req, res) {
      try {
        await Category_Model.deleteOne({_id: req.params.id});
        return res.redirect('/admin/category')
      } catch (error) {
        throw error;
      }
    }
  }
  
    
  module.exports = new CategoryController;