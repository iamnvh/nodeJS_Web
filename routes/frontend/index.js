const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.middleware')
const home = require('../../controllers/frontend/home.controller')
const login = require('../../controllers/frontend/login.controller')
const register = require('../../controllers/frontend/register.controller')
const shop = require('../../controllers/frontend/shop.controller')
const acc = require('../../controllers/frontend/acc.controller')
const book = require('../../controllers/frontend/product.controller')

//home
router.get('/', home.index);

// login
router.get('/login', login.loginview);
router.post('/login',login.login);


// register
router.get('/register', register.registerview);
router.post('/register',register.register);

//acc
router.get('/account',auth.authUser,acc.index)

// shop
router.get('/shop',shop.index);
router.get('/search/:id',home.searchbyid);


//shopdetai
router.get('/book/:id',book.index)





module.exports = router;