var express = require('express');
var router = express.Router();
var consultant_controller = require('../controllers/consultantController');
const auth = require('../authentication');

/* GET All Records */
router.get('/',auth.checkToken,consultant_controller.index);

/* GET Active Records */
router.get('/active',auth.checkToken,consultant_controller.active);

/* Add New Records */

router.post('/create',[auth.checkToken,consultant_controller.validate('create')],consultant_controller.create);

/* Update Record PUT Request */

router.post('/update/:id',[auth.checkToken,consultant_controller.validate('update')],consultant_controller.update);
router.get('/update/:id',auth.checkToken,consultant_controller.getupdate);


router.get('/get-consultant-list',auth.checkToken,consultant_controller.getConsultantList);



/* View Single Record */

router.get('/:id',auth.checkToken,consultant_controller.view);

module.exports = router;
