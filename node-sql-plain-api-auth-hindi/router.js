const Router = require('express').Router();
const { body } = require('express-validator');
const auth = require('./controllers/middlewares/auth');


Router.post('/register', body('email').isEmail() ,body('password').isLength({ min: 6 }), require('./controllers/auth/register'));
Router.post('/login', body('email').isEmail() ,body('password').isLength({ min: 6 }), require('./controllers/auth/login'));

Router.get('/profile', auth , require('./controllers/auth/profile'));
Router.get('/logout', auth , require('./controllers/auth/logout'));

module.exports = Router;