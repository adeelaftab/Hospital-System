var express = require('express');
var router = express.Router();
var chargescategory_controller = require('../controllers/chargescategoryController');
const auth = require('../authentication');

/* GET All Records */
router.get('/',auth.checkToken,chargescategory_controller.index);

/* GET Active Records */
router.get('/active',auth.checkToken,chargescategory_controller.active);

/* Add New Records */

router.post('/create',[auth.checkToken,chargescategory_controller.validate('create')],chargescategory_controller.create);

/* Update Record PUT Request */

router.post('/update/:id',[auth.checkToken,chargescategory_controller.validate('update')],chargescategory_controller.update);

module.exports = router;
