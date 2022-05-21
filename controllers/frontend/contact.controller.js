const Product_Model = require('../../models/book.model')
const Cart_Model = require('../../models/cart.model');
const Category_Model = require('../../models/category.model')
const Order_Model = require('../../models/order.model')
const User_Model = require('../../models/user.model')
const nodemailer = require('nodemailer');
const { verifyToken } = require('../../utli/verifyToken');
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class ContactController {
  index(req, res) {
    return res.render('./frontend/contact')
  }
  async send(req, res) {
    try {
      const email = req.body.email
      const name = req.body.name
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
          to: `${email}`,
          subject: "Xin chào khách hàng",
          html: "Xin chào "+name+" .Cảm ơn bạn đã góp ý, chúng tôi sẽ phản hồi email sớm nhất có thể!"
      },(err) => {
        if(err) {
          console.error(err);
        }
        else {
          console.log("Gửi mail thành công")
        }
      })
      return res.redirect("/")
    } catch (error) {
      console.log(error);
    }
    
  }
}

module.exports = new ContactController;