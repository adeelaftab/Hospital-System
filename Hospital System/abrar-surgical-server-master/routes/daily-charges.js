var express = require('express');
var router = express.Router();
var daily_charges_controller = require('../controllers/dailychargesController');
const auth = require('../authentication');


/* GET All Records */
router.get('/',auth.checkToken,daily_charges_controller.index);

router.post('/datatable',auth.checkToken,daily_charges_controller.dataTable);



/* Add New Records */

router.post('/create',[auth.checkToken,daily_charges_controller.validate('create')],daily_charges_controller.create);

/* Update Record PUT Request */

router.post('/update/:id',[auth.checkToken,daily_charges_controller.validate('update')],daily_charges_controller.update);

module.exports = router;
