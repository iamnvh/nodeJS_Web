class CartController {
  cart(req, res) {
    return res.render('./frontend/cart')
  }
}

module.exports = new CartController;