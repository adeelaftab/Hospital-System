var express = require('express');
var router = express.Router();
var payment_controller = require('../controllers/paymentController');
const auth = require('../authentication');

/* GET All Records */
//router.get('/',auth.checkToken,payment_controller.index);

//router.post('/datatable',auth.checkToken,payment_controller.dataTable);


/* Add New Records */

router.post('/create',[auth.checkToken,payment_controller.validate('create')],payment_controller.create);

/* View Invoice Payments Record */

router.get('/invoice/:id',auth.checkToken,payment_controller.viewInvoicePayment);

/* Update Payment */

//router.post('/update/:id',[auth.checkToken,payment_controller.validate('update')],payment_controller.update);



/* Generate Outdoor Invoice */

//router.post('/generate-outdoor-invoice',[auth.checkToken,payment_controller.validate('createOutdoorInvoice')],payment_controller.createOutdoorInvoice);


module.exports = router;
