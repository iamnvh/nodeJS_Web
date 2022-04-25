class CheckoutController {
  checkout(req, res) {
    return res.render('./frontend/checkout')
  }
}

module.exports = new CheckoutController;