var express = require('express');
var router = express.Router();
var reportcontroller = require('../controllers/reportController');
const auth = require('../authentication');


/* GET All Records */
router.post('/detail',auth.checkToken,reportcontroller.detail);


module.exports = router;
