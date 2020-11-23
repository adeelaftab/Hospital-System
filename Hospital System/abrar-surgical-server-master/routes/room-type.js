var express = require('express');
var router = express.Router();
var roomtype_controller = require('../controllers/roomtypeController');
const auth = require('../authentication');

/* GET All Records */
router.get('/',auth.checkToken,roomtype_controller.index);

/* GET Active Records */
router.get('/active',auth.checkToken,roomtype_controller.active);

/* Add New Records */

router.post('/create',[auth.checkToken,roomtype_controller.validate('create')],roomtype_controller.create);

/* Update Record PUT Request */

router.post('/update/:id',[auth.checkToken,roomtype_controller.validate('update')],roomtype_controller.update);

module.exports = router;
