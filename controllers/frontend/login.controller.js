const bcrypt = require("bcrypt");
const User_Model = require('../../models/user.model')
const {createToken} = require('../../utli/creatToken')


class LoginController {
  loginview(req, res) {
    return res.render('./frontend/login')
  }
  async login(req,res) {
    try {
      const user = await User_Model.findOne({
        email: req.body.email_name
      })
      if(user){
        const match = await bcrypt.compare(req.body.user_password,user.password)
        if(match){
          const tokenUser = await createToken(user._id)
          res.cookie('tokenUser',tokenUser)
          return res.redirect('/account')
        }
        else {
          res.render('./frontend/login',{errormatkhau: 'Mật khẩu không đúng.',email: req.body.email_name})
        }
      } else {
        res.render('./frontend/login',{erroremail: 'Email không tồn tại.',email: req.body.email_name})
      }
    } catch (error) {
    }
  }
}

module.exports = new LoginController;