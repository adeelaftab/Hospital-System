var express = require('express');
var router = express.Router();
var specialization_controller = require('../controllers/specializationController');
const auth = require('../authentication');

/* GET All Records */
router.get('/',auth.checkToken,specialization_controller.index);

/* GET Active Records */
router.get('/active',auth.checkToken,specialization_controller.active);

/* Add New Records */

router.post('/create',[auth.checkToken,specialization_controller.validate('create')],specialization_controller.create);

/* Update Record PUT Request */

router.post('/update/:id',[auth.checkToken,specialization_controller.validate('update')],specialization_controller.update);

module.exports = router;
