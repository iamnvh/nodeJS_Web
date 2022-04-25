class UserController {
    index(req, res) {
      return res.render('./backend/user/list-user')
    }
}
  
    
module.exports = new UserController;