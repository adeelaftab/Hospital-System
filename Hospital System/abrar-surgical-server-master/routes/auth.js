var express = require('express');
var router = express.Router();
var auth_controller = require('../controllers/authController');



/* Add New User */

router.post('/register',auth_controller.validate('register'),auth_controller.register);


/* Add Login */

router.post('/login',auth_controller.validate('login'),auth_controller.login);



module.exports = router;
