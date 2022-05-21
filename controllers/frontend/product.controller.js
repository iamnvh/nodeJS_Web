const Category_Model = require("../../models/category.model");
const Product_Model = require("../../models/book.model");
const User_Model = require("../../models/user.model");
const Cart_Model = require("../../models/cart.model");
const Review_Model = require("../../models/review.model");
const { verifyToken } = require("../../utli/verifyToken");
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../../utli/convertDataToObject");

class ProductDetailController {
  async index(req, res) {
    const category = await Category_Model.find({});
    res.locals.danhmuc = mutipleMongooseToObject(category);
    if (req.cookies.tokenUser) {
      const decodedToken = await verifyToken(req.cookies.tokenUser);
      const cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (cart == null) {
        res.locals.giohang = "";
      } else {
        res.locals.giohang = mutipleMongooseToObject(cart.products)
          ? mutipleMongooseToObject(cart.products)
          : "";
      }
      res.locals.giohang1 = cart;
      const id = req.params.id;
      const product = await Product_Model.findById(id);
      const releaseproduct = await Product_Model.find({
        categories: product.categories,
      }).limit(4);
      const [user, review] = await Promise.all([
        User_Model.findById(decodedToken.id),
        Review_Model.find({ product_id: product }),
      ]);
      if (req.query.name || req.query.review) {
        const decodedToken = await verifyToken(req.cookies.tokenUser);
        const productId = req.params.id;
        const user = await User_Model.findById(decodedToken.id);
        if (user) {
          const review = req.query.review;
          const name = req.query.name;
          await Review_Model.create({
            user_id: user._id,
            product_id: productId,
            name: name,
            review: review,
          });
        }
        return res.render("./frontend/productdetail", {
          datas: mongooseToObject(product),
          datasres: mutipleMongooseToObject(releaseproduct),
          user: user,
          review: review,
        });
      }
      return res.render("./frontend/productdetail", {
        datas: mongooseToObject(product),
        datasres: mutipleMongooseToObject(releaseproduct),
        user: user,
        review: review,
      });
    } else {
      const id = req.params.id;
      const product = await Product_Model.findById(id);
      const review = await Review_Model.find({ product_id: product });
      const releaseproduct = await Product_Model.find({
        categories: product.categories,
      }).limit(4);
      return res.render("./frontend/productdetail", {
        datas: mongooseToObject(product),
        datasres: mutipleMongooseToObject(releaseproduct),
        review: review,
      });
    }
  }
}

module.exports = new ProductDetailController();
