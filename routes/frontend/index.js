const express = require('express');
const router = express.Router();
const home = require('../../controllers/frontend/home.controller')
const login = require('../../controllers/frontend/login.controller')
const register = require('../../controllers/frontend/register.controller')
/* shopls = require('../../controllers/frontend/shop.controller')
shopdt = require('../../controllers/frontend/product.controller')
contact = require('../../controllers/frontend/contact.controller')
cart = require('../../controllers/frontend/cart.controller')
checkout = require('../../controllers/frontend/checkout.controller') */

//home
router.get('/', home.index);

// login
router.get('/login', login.loginview);
router.post('/login',login.login);


// register
router.get('/register', register.registerview);
router.post('/register',register.register);

/* // shop
router.get('/shop', shopls.shoplist);

//shopdetail
router.get('/product', shopdt.productdetail)

//contact
router.get('/contact', contact.contact)

//cart
router.get('/cart', cart.cart)

//checkout
router.get('/checkout', checkout.checkout) */

module.exports = router;