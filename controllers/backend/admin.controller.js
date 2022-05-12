Admin_Model = require('../../models/admin.model')
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { mutipleMongooseToObject, mongooseToObject } = require('../../utli/convertDataToObject');

class AdminController {
	async index(req, res) {
		const pageNumber = req.query.page;
		const perPage = 4;
		const [admins, totalAdmins] = await Promise.all([
			Admin_Model.find({}).limit(perPage).skip((pageNumber - 1) * perPage),
			Admin_Model.countDocuments()
		]);
		const pages = [];
		const totalPages = Math.ceil(totalAdmins / perPage);
		for (let i = 1; i <= totalPages; i++) {
			pages.push(i)
		}
		return res.render('./backend/admin/list-admin', {
			datas: mutipleMongooseToObject(admins),
			pages: pages
		});
	}
	async creat(req, res) {
		try {
			return res.render('./backend/admin/register')
		} catch (error) {
			throw error;
		}
	}
	async store(req, res) {
		try {
			const admin = await Admin_Model.findOne({ email: req.body.email });
			if (admin) {
				return res.render('./backend/admin/register', { erroremail: 'Email này đã được sử dụng.', email: req.body.email })
			} else {
				bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
					Admin_Model.create({
						name: req.body.username,
						email: req.body.email,
						password: hash,
						role: "admin",
					})
				});
			}
			return res.redirect('/admin/admin')
		} catch (error) {
			throw error;
		}
	}
}


module.exports = new AdminController;