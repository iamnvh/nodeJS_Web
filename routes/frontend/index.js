const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.middleware')
const home = require('../../controllers/frontend/home.controller')
const login = require('../../controllers/frontend/login.controller')
const register = require('../../controllers/frontend/register.controller')
const shop = require('../../controllers/frontend/shop.controller')
const acc = require('../../controllers/frontend/acc.controller')
const book = require('../../controllers/frontend/product.controller')
const contact = require('../../controllers/frontend/contact.controller')
const cart = require('../../controllers/frontend/cart.controller')
const logout = require('../../controllers/frontend/logout.controller')
const checkout = require('../../controllers/frontend/checkout.controller')

//home
router.get('/', home.index);

// login
router.get('/login', login.loginview);
router.post('/login', login.login);

//logout
router.get('/logout', logout.logout)

// register
router.get('/register', register.registerview);
router.post('/register', register.register);

//acc
router.get('/account', auth.authUser, acc.index)
router.post('/confirm/:id', auth.authUser, acc.confirm)

// shop
router.get('/shop', shop.index);
router.get('/search/:id', home.searchbyid);


//shopdetai
router.get('/book/:id', book.index)

//contact
router.get('/contact', contact.index)


//cart
router.post('/add/:id', auth.authUser, cart.addToCartindex)
router.post('/book/:id', auth.authUser, cart.addToCart)
router.get('/cart', auth.authUser, cart.index)
router.get('/remove-product-cart/:id', auth.authUser, cart.removeProductCart);

//checkout

router.get('/checkout', auth.authUser, checkout.index)
router.post('/checkout', auth.authUser, checkout.checkout)






module.exports = router;