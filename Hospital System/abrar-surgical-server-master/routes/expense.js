var express = require('express');
var router = express.Router();
var expense_controller = require('../controllers/expenseController');
const auth = require('../authentication');

/* GET All Records */
router.get('/',auth.checkToken,expense_controller.index);

/* GET Active Records */
router.get('/active',auth.checkToken,expense_controller.active);

router.post('/datatable',auth.checkToken,expense_controller.dataTable);

/* Add New Records */

router.post('/create',[auth.checkToken,expense_controller.validate('create')],expense_controller.create);

/* Update Record PUT Request */

router.post('/update/:id',[auth.checkToken,expense_controller.validate('update')],expense_controller.update);

module.exports = router;
