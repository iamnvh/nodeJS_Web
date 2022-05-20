const Category_Model = require('../../models/category.model')
const Product_Model = require('../../models/book.model')
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');
const Cart_Model = require('../../models/cart.model');
const { verifyToken } = require('../../utli/verifyToken');


class CartController {
  async index(req, res) {
    try {
      if (req.cookies.tokenUser) {
        const decodedToken = await verifyToken(req.cookies.tokenUser)
        const cart = await Cart_Model.findOne({ user_id: decodedToken.id });
        if (cart == null) {
          res.locals.giohang = ""
        } else {
          res.locals.giohang = (mutipleMongooseToObject(cart.products) ? mutipleMongooseToObject(cart.products) : "")
        }
        res.locals.giohang1 = cart
      }
      const category = await Category_Model.find({});
      res.locals.danhmuc =  mutipleMongooseToObject(category)
      const decodedToken = await verifyToken(req.cookies.tokenUser);
      const cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (req.cookies.token) {
        const decodedToken = await verifyToken(req.cookies.tokenUser);
        const cartProduct = await Cart_Model.find({ user_id: decodedToken.id });
        
        if (cartProduct) {
          res.locals.cart = cartProduct[0];
          res.locals.cartProduct = cartProduct[0].products
        }
      }
      
      if(cart) {
        return res.render('./frontend/cart', {
          datas: mutipleMongooseToObject(cart.products) ? mutipleMongooseToObject(cart.products) : {},
          cart: cart,
        })
      } else {
        return res.render('./frontend/cart')
      }
      
    } catch (error) {
      console.log(error)
    }
  }
  async addToCartindex(req, res) {
    try {
      const [decodeToken, product] = await Promise.all([
        verifyToken(req.cookies.tokenUser),
        Product_Model.findById(req.params.id)
      ]);
      let cart = await Cart_Model.findOne({ user_id: decodeToken.id });
      if (cart) {
        let itemIndex = cart.products.findIndex(p => p.productID == req.params.id);
        if (itemIndex > -1) {
          let productItem = cart.products[itemIndex];
          productItem.quantity += 1;
          cart.products[itemIndex] = productItem;
          cart.totalPrice += productItem.price;
        } else {
          //product does not exists in cart, add new item
          cart.products.push({
            productID: product._id,
            quantity: 1,
            name: product.name,
            photo: product.photo,
            price: product.price * (1 - product.discount * 0.01),
            discount: product.discount
          })
          cart.totalPrice += 1 * product.price * (1 - product.discount * 0.01);
        }
        cart = await cart.save();
        return res.redirect('/cart');
      } else {
        await Cart_Model.insertMany({
          user_id: decodeToken.id,
          products: [{
            productID: product._id,
            quantity: 1,
            name: product.name,
            photo: product.photo,
            price: product.price * (1 - product.discount * 0.01),
            discount: product.discount
          }],
          totalPrice: (product.price * (1 - product.discount * 0.01))
        })
        return res.redirect('/cart')
      }
    } catch (error) {
      console.log(error);
    }
  }
  async addToCart(req, res) {
    try {
      const [decodeToken, product] = await Promise.all([
        verifyToken(req.cookies.tokenUser),
        Product_Model.findById(req.params.id)
      ]);
      let cart = await Cart_Model.findOne({ user_id: decodeToken.id });
      if (cart) {
        let itemIndex = cart.products.findIndex(p => p.productID == req.params.id);
        if (itemIndex > -1) {
          let productItem = cart.products[itemIndex];
          productItem.quantity += Number(req.body.add_product);
          cart.products[itemIndex] = productItem;
          cart.totalPrice += productItem.price * Number(req.body.add_product);
        } else {
          cart.products.push({
            productID: product._id,
            quantity: Number(req.body.add_product),
            name: product.name,
            photo: product.photo,
            price: product.price * (1 - product.discount * 0.01),
            discount: product.discount
          })
          cart.totalPrice += Number(req.body.add_product) * product.price * (1 - product.discount * 0.01);
        }
        cart = await cart.save();
        return res.redirect('/cart');
      } else {
        await Cart_Model.insertMany({
          user_id: decodeToken.id,
          products: [{
            productID: product._id,
            quantity: Number(req.body.add_product),
            name: product.name,
            photo: product.photo,
            price: product.price * (1 - product.discount * 0.01),
            discount: product.discount
          }],
          totalPrice: (product.price * (1 - product.discount * 0.01)) * Number(req.body.add_product)
        })
        return res.redirect('/cart')
      }
    } catch (error) {
      console.log(error)
    }
  }
  async removeProductCart(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.tokenUser);
      let cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (cart) {
        const itemIndex = cart.products.findIndex(p => p._id.toString() === req.params.id);
        if (itemIndex > -1) {
          let productItem = cart.products[itemIndex];
          cart.totalPrice -= productItem.price * productItem.quantity;
          cart.products.splice(itemIndex, 1);
        }
        cart = await cart.save();
      }
      return res.redirect('/cart');
    } catch (error) {
      console.log(error.message)
    }
  }
}

module.exports = new CartController;