var express = require('express');
var router = express.Router();
var helpercontroller = require('../controllers/helperController');
const auth = require('../authentication');


/* GET All Records */
router.post('/sms',auth.checkToken,helpercontroller.sms);

router.get('/dashboard',auth.checkToken,helpercontroller.dashboard);

router.get('/auto-charges',helpercontroller.autoCharges);


router.post('/diagPush/:id',auth.checkToken,helpercontroller.sendDiag);


/* GET All Tests */
router.get('/test',helpercontroller.getTest);

module.exports = router;
