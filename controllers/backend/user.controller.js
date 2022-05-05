User_Model = require('../../models/user.model')
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class UserController {
  async index(req, res) {
    const pageNumber = req.query.page;
    const perPage = 4;
    const [users, totalUsers] = await Promise.all([
      User_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
      User_Model.countDocuments()
    ]);
    const pages = [];
    const totalPages = Math.ceil(totalUsers / perPage);
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return res.render('./backend/user/list-user', {
      datas: mutipleMongooseToObject(users),
      pages: pages
    });
  }
  async delete(req, res) {
    try {
      await User_Model.deleteOne({_id: req.params.id});
      return res.redirect('/admin/user')
    } catch (error) {
      throw error;
    }
  }
}
  
    
module.exports = new UserController;