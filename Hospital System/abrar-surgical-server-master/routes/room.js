var express = require('express');
var router = express.Router();
var room_controller = require('../controllers/roomController');
const auth = require('../authentication');


/* GET All Records */
router.get('/',auth.checkToken,room_controller.index);

router.post('/datatable',auth.checkToken,room_controller.dataTable);


// GET Avaliable


router.get('/available',auth.checkToken,room_controller.available);

/* Add New Records */

router.post('/create',[auth.checkToken,room_controller.validate('create')],room_controller.create);

/* Update Record PUT Request */

router.post('/update/:id',[auth.checkToken,room_controller.validate('update')],room_controller.update);

module.exports = router;
