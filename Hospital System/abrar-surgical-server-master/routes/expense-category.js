var express = require('express');
var router = express.Router();
var expensecategory_controller = require('../controllers/expensecategoryController');
const auth = require('../authentication');

/* GET All Records */
router.get('/',auth.checkToken,expensecategory_controller.index);

/* GET Active Records */
router.get('/active',auth.checkToken,expensecategory_controller.active);

/* Add New Records */

router.post('/create',[auth.checkToken,expensecategory_controller.validate('create')],expensecategory_controller.create);

/* Update Record PUT Request */

router.post('/update/:id',[auth.checkToken,expensecategory_controller.validate('update')],expensecategory_controller.update);

module.exports = router;
