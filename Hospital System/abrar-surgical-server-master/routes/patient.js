var express = require('express');
var router = express.Router();
var patient_controller = require('../controllers/patientController');
const auth = require('../authentication');

/* GET All Records */
router.get('/',auth.checkToken,patient_controller.index);

router.post('/datatable',auth.checkToken,patient_controller.dataTable);
/* Add New Records */

router.post('/create',[auth.checkToken,patient_controller.validate('create')],patient_controller.create);


router.get('/get-patient-name',auth.checkToken,patient_controller.getPatientName);
router.get('/get-phone-number',auth.checkToken,patient_controller.getPatientMobileNumber);
router.get('/get-patient-id',auth.checkToken,patient_controller.getPatientID);
/* View Single Record */

router.get('/:id',auth.checkToken,patient_controller.view);







/* Update Record */

router.post('/update/:id',[auth.checkToken,patient_controller.validate('update')],patient_controller.update);

module.exports = router;
