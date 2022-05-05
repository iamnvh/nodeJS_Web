class LogoutController {
    logout(req, res) {
      res.clearCookie('tokenAdmin');
      return res.redirect('/admin/login');
    }
  }
  
  module.exports = new LogoutController;