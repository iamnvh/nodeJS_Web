class ProductDetailController {
  productdetail(req, res) {
    return res.render('./frontend/productdetail')
  }
}

module.exports = new ProductDetailController;