const Product_Model = require('../../models/book.model')
const Cart_Model = require('../../models/cart.model');
const Category_Model = require('../../models/category.model')
const Order_Model = require('../../models/order.model')
const User_Model = require('../../models/user.model')
const nodemailer = require('nodemailer');
const { verifyToken } = require('../../utli/verifyToken');
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');
const stripe = require('stripe')('sk_test_51L1szfDeVbmizZkBkIpiqDvFnr8BUqWqn3nR2WZyomvRqYTk7OIzWb0Yq1sp7m2k5XJo4AN0ggnlOmYdJ5FU1HeN005HuyQeJY');
class CheckoutController {
  async index(req, res) {
    try {
      const category = await Category_Model.find({});
      res.locals.danhmuc = mutipleMongooseToObject(category)
      const decodedToken = await verifyToken(req.cookies.tokenUser)
      const cart = await Cart_Model.findOne({ user_id: decodedToken.id });
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
      if(cart) {
        if (cart.products.length > 0) {
          return res.render('./frontend/checkout', {
            datas: mutipleMongooseToObject(cart.products) ? mutipleMongooseToObject(cart.products) : {},
            cart: cart,
            key: 'pk_test_51L1szfDeVbmizZkBlOhAzKaMVV5BuZKpPB2bPpKYlrA03KxbB1aNPXrTwueQSU1PJvwHWl2G4RUQheqR8wLFtdLP00E4Th9Thj',
          })
        } else {
          return res.redirect('/cart')
        }
          
      } else {
        return res.redirect('/cart')
      }
    } catch (error) {
      console.log(error);
    }
  }
  async checkout(req, res) {
    try {
      const decodedToken = await verifyToken(req.cookies.tokenUser);
      const cart = await Cart_Model.findOne({ user_id: decodedToken.id });
      if (cart) {
        await Order_Model.insertMany({
          user_id: cart.user_id,
          products: cart.products,
          totalPrice: cart.totalPrice,
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          status: '0',
        })
        const order = await Cart_Model.findOne({ user_id: decodedToken.id });
        if (order.products.length > 0) {
          for (let i = 0; i < order.products.length; i++) {
            const amountProduct = await Product_Model.findById(order.products[i].productID)
            await Product_Model.updateOne({ _id: amountProduct._id }, { amount: amountProduct.amount - order.products[i].quantity })
          }
        }
        await Cart_Model.deleteOne({ user_id: decodedToken.id });
        try {
          const productOrder = await Order_Model.findOne({ user_id: decodedToken.id });
          let name = "";
          for(let i = 0; i <productOrder.products.length; i++) {
            name += ""+productOrder.products[i].name+" - đơn giá: "+productOrder.products[i].price+"đ - số lượng : "+ productOrder.products[i].quantity+"<br>";
          }
          const price = new Intl.NumberFormat('vn-IN', { maximumSignificantDig: 3}).format((productOrder.totalPrice).toFixed())
          const email = await User_Model.findOne({ _id: decodedToken.id})
          let transporter = nodemailer.createTransport( {
              host: 'smtp.gmail.com',
              service: 'gmail',
              auth: {
                  user: process.env.EMAIL_AUTH,
                  pass: process.env.EMAIL_PASSWORD,
              }
          });
          await transporter.sendMail({
              from:process.env.EMAIL_AUTH,
              to: `${email.email}`,
              subject: "Xin chào khách hàng",
              html: "<h3>Xin chào</h3><p>Lời đầu tiên Dking xin cảm ơn quý khách hàng đã tin tưởng lựa chọn sản phẩm của chúng tôi.</p>" +
                    "<p>Thông tin về đơn hàng của quý khách: </p>" + name +"Tổng giá trị đơn hàng: "+price+ "đ <br>Địa chỉ nhận hàng: "+productOrder.address+
                    "<br>Số điện thoại nhận hàng: "+ productOrder.phone+
                    "<p>Vui lòng kiểm tra đơn hàng của quý khách.</p>" + "Có thắc mắc vui lòng liên hệ email: " +process.env.EMAIL_AUTH
          },(err) => {
            if(err) {
                console.error(err);
            }
            else {
                console.log("Gửi mail thành công")
            }
          })
        } catch (error) {
          console.log(error)
        }
        return res.redirect('/')
      } else {
        return res.redirect('/cart')
      }
    } catch (error) {
      console.log(error);
    }
  }
  async payment(req, res) {
    try {
      
      const decodedToken = await verifyToken(req.cookies.tokenUser);
      const us = await User_Model.findById(decodedToken.id)
      const [user, cart] = await Promise.all([
        User_Model.findById(decodedToken.id),
        Cart_Model.findOne({ user_id: decodedToken.id })
      ]);
      stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: user.username,
        address: {
          line1: 'Pham Van Dong - Mai Dich - Cau Giay',
          postal_code: '110092',
          city: 'Ha Noi',
          state: '',
          country: 'Vietnamese',
        }
      }).then((customer) => {
        return stripe.charges.create({
          amount: +cart.totalPrice,
          description: 'Mua hang tai cua hang Dking',
          currency: 'USD',
          customer: customer.id
        }).then((charge) => {
          return res.redirect('/shop');
        }).catch((err) => {
          console.log(err);
        })
      });
      if (cart) {
        await Order_Model.insertMany({
          user_id: cart.user_id,
          products: cart.products,
          totalPrice: cart.totalPrice,
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          status: '0',
        })
        const order = await Cart_Model.findOne({ user_id: decodedToken.id });
        if (order.products.length > 0) {
          for (let i = 0; i < order.products.length; i++) {
            const amountProduct = await Product_Model.findById(order.products[i].productID)
            await Product_Model.updateOne({ _id: amountProduct._id }, { amount: amountProduct.amount - order.products[i].quantity })
          }
        }
        await Cart_Model.deleteOne({ user_id: decodedToken.id });
        try {
          const productOrder = await Order_Model.findOne({ user_id: decodedToken.id });
          let name = "";
          for(let i = 0; i <productOrder.products.length; i++) {
            name += ""+productOrder.products[i].name+" - đơn giá: "+productOrder.products[i].price+"đ - số lượng : "+ productOrder.products[i].quantity+"<br>";
          }
          const price = new Intl.NumberFormat('vn-IN', { maximumSignificantDig: 3}).format((productOrder.totalPrice).toFixed())
          const email = await User_Model.findOne({ _id: decodedToken.id})
          let transporter = nodemailer.createTransport( {
              host: 'smtp.gmail.com',
              service: 'gmail',
              auth: {
                  user: process.env.EMAIL_AUTH,
                  pass: process.env.EMAIL_PASSWORD,
              }
          });
          await transporter.sendMail({
              from:process.env.EMAIL_AUTH,
              to: `${email.email}`,
              subject: "Xin chào khách hàng",
              html: "<h3>Xin chào</h3><p>Lời đầu tiên Dking xin cảm ơn quý khách hàng đã tin tưởng lựa chọn sản phẩm của chúng tôi.</p>" +
                    "<p>Thông tin về đơn hàng của quý khách: </p>" + name +"Tổng giá trị đơn hàng: "+price+ "đ <br>Địa chỉ nhận hàng: "+productOrder.address+
                    "<br>Số điện thoại nhận hàng: "+ productOrder.phone+
                    "<p>Vui lòng kiểm tra đơn hàng của quý khách.</p>" + "Có thắc mắc vui lòng liên hệ email: " +process.env.EMAIL_AUTH
          },(err) => {
            if(err) {
                console.error(err);
            }
            else {
                console.log("Gửi mail thành công")
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new CheckoutController;