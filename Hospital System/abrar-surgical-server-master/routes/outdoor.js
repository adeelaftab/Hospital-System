var express = require('express');
var router = express.Router();
var outdoor_controller = require('../controllers/outdoorController');
const auth = require('../authentication');

/* GET All Records */
router.get('/',auth.checkToken,outdoor_controller.index);

router.post('/datatable',auth.checkToken,outdoor_controller.dataTable);
router.post('/today-datatable',auth.checkToken,outdoor_controller.todaydataTable);
router.get('/get-outdoor-id',auth.checkToken,outdoor_controller.getOutdoorID);
/* Add New Records */

router.post('/create',[auth.checkToken,outdoor_controller.validate('create')],outdoor_controller.create);


router.post('/update/:id',auth.checkToken,outdoor_controller.update);
router.post('/update-charges/:id',auth.checkToken,outdoor_controller.updateCharges);

/* View Single Record */

router.get('/:id',auth.checkToken,outdoor_controller.view);


/* View Single Record Charges */

router.get('/charges/:id',auth.checkToken,outdoor_controller.viewCharges);


/* Add New Charges */

router.post('/charges/:id',auth.checkToken,outdoor_controller.addCharges);


module.exports = router;
