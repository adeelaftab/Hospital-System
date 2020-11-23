var express = require('express');
var router = express.Router();
var charges_controller = require('../controllers/chargesController');
const auth = require('../authentication');


/* GET All Records */
router.get('/',auth.checkToken,charges_controller.index);

router.post('/datatable',auth.checkToken,charges_controller.dataTable);

/* GET All By Cateogry Active */
router.get('/getbycategory/:id',auth.checkToken,charges_controller.getbycategory);


/* Add New Records */

router.post('/create',[auth.checkToken,charges_controller.validate('create')],charges_controller.create);

/* Update Record PUT Request */

router.post('/update/:id',[auth.checkToken,charges_controller.validate('update')],charges_controller.update);

module.exports = router;
