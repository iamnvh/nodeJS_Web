const { verifyToken } = require("../utli/verifyToken");
const User_Model = require("../models/user.model");
const Admin_Model = require("../models/admin.model");

class authMiddleware {
  async checkUser(req, res, next) {
    try {
      const token = req.cookies.tokenUser;
      if (!token) {
        res.locals.user = null;
        next();
      }
      const decodeToken = await verifyToken(token);
      const user = await User_Model.findById(decodeToken.id);
      if (!user) {
        res.locals.user = null;
        next();
      }
      res.locals.user = user;
      next();
    } catch (error) {
      throw error;
    }
  }

  async checkAdmin(req, res, next) {
    try {
      const tokenAdmin = req.cookies.tokenAdmin;
      if (tokenAdmin) {
        const decodeTokenAdmin = await verifyToken(tokenAdmin);
        const admin = await Admin_Model.findById(decodeTokenAdmin.id);
        req.admin = admin;
        res.locals.admin = admin;
        next();
      } else {
        next();
      }
    } catch (error) {
      throw error;
    }
  }

  async authAdmin(req, res, next) {
    try {
      const tokenAdmin = req.cookies.tokenAdmin;
      if (!tokenAdmin) {
        return res.redirect("/admin/login");
      } else {
        const decodeTokenAdmin = await verifyToken(tokenAdmin);
        const admin = await Admin_Model.findById(decodeTokenAdmin.id);
        if (admin) {
          req.admin = admin;
          next();
        } else {
          return res.redirect("/admin/login");
        }
      }
    } catch (error) {
			throw error;
		}
  }
	async authUser(req, res, next) {
    try {
      const token = req.cookies.tokenUser;
      if (!token) {
        return res.redirect('/login');
      } else {
        const decodedToken = await verifyToken(token);
        const user = await User_Model.findById(decodedToken.id);
        if (user) {
          req.user = user;
          return next();
        } else {
          return res.redirect('/login');
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new authMiddleware();
