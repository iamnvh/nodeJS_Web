class ProductController {
  index(req, res) {
    return res.render('./backend/product/list-product')
  }
  creat(req, res) {
    return res.render('./backend/product/add-product')
  }
  details(req, res) {
    return res.render('./backend/product/details-product')
  }
  store(req, res) {
    
  }
  edit(req, res) {
    return res.render('./backend/add-product')
  }
  update(req, res) {
    
  }
  delete(req, res) {
    
  }
}

  
module.exports = new ProductController;