class HomeController {
  index(req, res) {
    return res.render('./frontend/index')
  }
}

module.exports = new HomeController;