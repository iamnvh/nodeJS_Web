const bcrypt = require("bcrypt");
const User_Model = require("../../models/user.model");
const { createToken } = require("../../utli/creatToken");
const nodemailer = require("nodemailer");
const {verifyToken } = require("../../utli/verifyToken");
const saltRounds = 10;

class ForgotPassword {
  index(req, res) {
    return res.render("./frontend/forgot-password");
  }
  wait(req, res) {
    return res.render("./frontend/wait-password");
  }
  async forgotpassword(req, res) {
    const email = req.body.email_name;
    const checkemail = await User_Model.findOne({ email: email });
    if (checkemail) {
      const tokenUser = await createToken(checkemail._id);
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        auth: {
          user: process.env.EMAIL_AUTH,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      await transporter.sendMail(
        {
          from: process.env.EMAIL_AUTH,
          to: `${email}`,
          subject: "Bạn quên mật khẩu ?",
          html: `<p>Vui lòng click vào đường link bên dưới để lấy lại mật khẩu.</p><p><a href="http://localhost:5000/forgot-password/${tokenUser}">Lấy lại mật khẩu?</a></p>`,
        },
        (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Gửi mail thành công");
          }
        }
      );
    }
    return res.redirect("/wait-forgot");
  }
  catch(error) {
    console.log(error);
  }
  async checkemail(req, res) {
    try {
			const tokenUser = req.params.id;
			const decodedToken = await verifyToken(tokenUser);
			const user = await User_Model.findOne({ _id: decodedToken.id });
			if (user) {
				res.render("./frontend/reset-password")
			}
		} catch (error) {
			console.log(error);
		}
  }
	async resetpassword(req, res) {
		try {
      const tokenUser = req.params.id;
      const decodedToken = await verifyToken(tokenUser);
      const id = decodedToken.id
			const password = req.body.password;
			const repassword = req.body.repassword;
			if(password == repassword) {
        const hash = await bcrypt.hash(password, saltRounds);
        await User_Model.updateOne({_id: id}, {password: hash})
        return res.redirect('/login');
			} else {
				res.render('./frontend/reset-password',{errorrepassword: 'Mật khẩu không trung nhau!',password: req.body.password})
			}
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = new ForgotPassword();
