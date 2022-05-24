const express = require('express');
const router = express.Router();
const product = require('../../controllers/backend/product.controller')
const user = require('../../controllers/backend/user.controller')
const admin = require('../../controllers/backend/admin.controller')
const login = require('../../controllers/backend/login.controller')
const logout = require('../../controllers/backend/logout.controller')
const auth = require('../../middleware/auth.middleware')
const category = require('../../controllers/backend/category.controller')
const upload = require('../../utli/uploadImage')
const order = require('../../controllers/backend/order.controller')
const store = require('../../controllers/backend/statistacal.controller')


//login
router.get('/login', login.index)
router.post('/login', login.login)

//product
router.get('/product', auth.authAdmin, product.index);
router.get('/product/creat', auth.authAdmin, product.creat);
router.post('/product/creat', auth.authAdmin, upload.single('photo'), product.store);
router.get('/product/details/:id', auth.authAdmin, product.details);
router.get('/product/edit/:id', auth.authAdmin, product.edit);
router.put('/product/edit/:id', auth.authAdmin, upload.single('photo'), product.update);
router.delete('/product/delete/:id', auth.authAdmin, product.delete);


//category
router.get('/category', auth.authAdmin, category.index);
router.get('/category/creat', auth.authAdmin, category.creat)
router.post('/category/creat', auth.authAdmin, category.store)
router.get('/category/edit/:id', auth.authAdmin, category.edit)
router.put('/category/edit/:id', auth.authAdmin, category.update)
router.delete('/category/delete/:id', auth.authAdmin, category.delete)



//user
router.get('/user', auth.authAdmin, user.index);
router.delete('/user/delete/:id', auth.authAdmin, user.delete)

//admin
router.get('/admin', auth.authAdmin, admin.index);
router.get('/admin/creat', auth.authAdmin, admin.creat);
router.post('/admin/creat', auth.authAdmin, admin.store);

//order
router.get('/order', auth.authAdmin, order.index)
router.get('/search', auth.authAdmin, store.index)
router.post('/search', auth.authAdmin, store.search)
router.post('/confirm/:id', auth.authAdmin, order.confirm)
router.delete('/delete/:id', auth.authAdmin, order.delete)

//logout router
router.get('/logout', logout.logout);


module.exports = router;