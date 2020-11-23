var express = require('express');
var router = express.Router();
var indoor_controller = require('../controllers/indoorController');
const auth = require('../authentication');

/* GET All Records */
router.get('/',auth.checkToken,indoor_controller.index);

router.post('/create',[auth.checkToken,indoor_controller.validate('create')],indoor_controller.create);
router.get('/:id',auth.checkToken,indoor_controller.view);
router.post('/update/:id',auth.checkToken,indoor_controller.update);
router.post('/update-charges/:id',auth.checkToken,indoor_controller.updateCharges);
router.post('/datatable',auth.checkToken,indoor_controller.dataTable);
router.post('/active-datatable',auth.checkToken,indoor_controller.activedataTable);
router.get('/get-indoor-id',auth.checkToken,indoor_controller.getIndoorID);
router.get('/discharge/:id',auth.checkToken,indoor_controller.discharge);
router.get('/charges/:id',auth.checkToken,indoor_controller.viewCharges);
router.post('/charges/:id',auth.checkToken,indoor_controller.addCharges);
module.exports = router;
