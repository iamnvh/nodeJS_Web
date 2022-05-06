class LogoutController {
    logout(req, res) {
      res.clearCookie('tokenUser');
      return res.redirect('/login');
    }
  }
  
  module.exports = new LogoutController;