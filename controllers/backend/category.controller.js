const { redirect } = require('express/lib/response');
const Category_Model = require('../../models/category.model')

class CategoryController {
    index(req, res) {
      return res.render('./backend/category/list-category')
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
          return res.redirect('/list-category')
        }
      } catch (error) {
        throw error;
      }
    }
    async edit(req, res) {
      try {
        const category = await Category_Model.findById(req.params.id);
        return res.render('./backend/category/')
      } catch (error) {
        
      }
    }
    update(req, res) {
      
    }
    delete(req, res) {
      
    }
  }
  
    
  module.exports = new CategoryController;