const users = require('./frontend/index');
const admin = require('./backend/index');
const middleware = require('../middleware/auth.middleware');

function Router(app) {
  app.use('/',users);
  app.use('/admin',middleware.checkAdmin,admin);
};

module.exports = Router;
