var express = require('express');
var router = express.Router();
var testcategory_controller = require('../controllers/testcategoryController');
const auth = require('../authentication');

/* GET All Records */
router.get('/',auth.checkToken,testcategory_controller.index);

/* GET Active Records */
router.get('/active',auth.checkToken,testcategory_controller.active);

/* Add New Records */

router.post('/create',[auth.checkToken,testcategory_controller.validate('create')],testcategory_controller.create);

/* Update Record PUT Request */

router.post('/update/:id',[auth.checkToken,testcategory_controller.validate('update')],testcategory_controller.update);

module.exports = router;
