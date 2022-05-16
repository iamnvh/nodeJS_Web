const bcrypt = require("bcrypt");
const saltRounds = 10;
const User_Model = require("../../models/user.model");

class RegisterController {
  registerview(req, res) {
    return res.render("./frontend/register");
  }
	
  register(req, res) {
		const password = req.body.user_password
		bcrypt.hash(password, saltRounds).then(function(hash) {
			User_Model.create({
				name: req.body.user_name,
				email: req.body.user_email,
				password: hash,
				role: "user",
				token: "",
			})
		});
		return res.redirect("/login");
  }
}
module.exports = new RegisterController();
