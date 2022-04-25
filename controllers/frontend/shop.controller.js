class ShopListController {
  shoplist(req, res) {
    return res.render('./frontend/shop')
  }
}

module.exports = new ShopListController;