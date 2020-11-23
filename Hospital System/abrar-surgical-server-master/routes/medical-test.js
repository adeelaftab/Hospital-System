var express = require('express');
var router = express.Router();
var medicaltest_controller = require('../controllers/medicaltestController');
const auth = require('../authentication');


/* GET All Records */
router.get('/',auth.checkToken,medicaltest_controller.index);

/* Add New Records */

router.post('/create',[auth.checkToken,medicaltest_controller.validate('create')],medicaltest_controller.create);

/* Update Record PUT Request */

router.post('/update/:id',[auth.checkToken,medicaltest_controller.validate('update')],medicaltest_controller.update);

module.exports = router;
