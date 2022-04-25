const bcrypt = require("bcrypt");
const Admin_Model = require('../../models/admin.model')
const {createToken} = require('../../utli/creatToken')


class LoginController {
    index(req, res) {
      return res.render('./backend/login')
    }
    async login(req,res) {
        try {
          const admin = await Admin_Model.findOne({
            email: req.body.email
          })
          if(admin){
            const match = await bcrypt.compare(req.body.password,admin.password)
            if(match){
              const tokenAdmin = await createToken(admin._id)
              res.cookie('tokenAdmin',tokenAdmin);
              return res.redirect('/admin')
            }
            else {
              res.render('./backend/login',{errormatkhau: 'Mật khẩu không đúng.'})
            }
          } else {
            res.render('./backend/login',{erroremail: 'Email không tồn tại.',email: req.body.email})
          }
        } catch (error) {
        }
      }
  }
  
    
  module.exports = new LoginController;