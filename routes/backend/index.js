const express = require('express');
const router = express.Router();
const product = require('../../controllers/backend/product.controller')
const user = require('../../controllers/backend/user.controller')
const login = require('../../controllers/backend/login.controller')
const auth = require('../../middleware/auth.middleware')
const category = require('../../controllers/backend/category.controller')


//login
router.get('/login',login.index)
router.post('/login',login.login)

//product
router.get('/product',auth.authAdmin, product.index);
router.get('/product/creat',auth.authAdmin, product.creat);
router.post('/product/creat',auth.authAdmin, product.creat);
router.get('/product/details',auth.authAdmin,product.details);

//category
router.get('/category',auth.authAdmin, category.index);
router.get('/category/creat',auth.authAdmin, category.creat);
router.post('/category/creat',auth.authAdmin, category.store);
router.get('/category/edit',auth.authAdmin, category.edit)


//user
router.get('/user',auth.authAdmin,user.index);






module.exports = router;