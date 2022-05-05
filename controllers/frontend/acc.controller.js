const User_Model = require('../../models/user.model')
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class AccController {
  async index(req, res) {
    return res.render('./frontend/my-acc.pug')
  }
}

module.exports = new AccController;