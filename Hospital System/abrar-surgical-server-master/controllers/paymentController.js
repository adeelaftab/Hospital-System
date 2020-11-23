const Payment = require('../models/payment');
const { check, validationResult } = require('express-validator/check');
const Outdoor = require('../models/outdoor');
const Indoor = require('../models/indoor');

exports.validate = (method) => {
switch (method) {
    case 'create': {
     return [ 
    check('amount', 'Amount is required').exists().not().isEmpty().isNumeric().withMessage('Amount Must Be Number'),
	check('note').optional({checkFalsy: true}),
	check('invoice_id').exists().not().isEmpty(),
	check('invoice_type').exists().isIn(['indoor', 'outdoor']).withMessage('Incorrect Invoice Type value'),
	check('patient_id').exists().not().isEmpty(),
    check('status').exists().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value')
       ]    
    }
	case 'update': {
     return [ 
    check('amount', 'Amount is required').exists().not().isEmpty().isNumeric().withMessage('Amount Must Be Number'),
	check('note').optional({checkFalsy: true}),
    check('status').exists().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value')
       ]    
    }
  }
}


exports.viewInvoicePayment = function(req, res) {
	
   Payment.find({'invoice_id':req.params.id,'status':'active'})
   //.select('charges invoice')
   .populate('created_by', 'first_name last_name')
    .exec()
    .then(docs => {
      //console.log(docs);
      //   if (docs.length >= 0) {
      var data = docs;
	  
	  res.status(200).json(docs);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(501).json({
        error: err
      });
    });
};

exports.create = function(req, res ,  next) {
	
   const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
    }
	
	
	var mPayment = new Payment  ({
    amount : req.body.amount,
    note  :req.body.note,
    status:req.body.status,
    invoice_id : req.body.invoice_id,
	patient_id : req.body.patient_id,
	invoice_type : req.body.invoice_type,
	payment_type : 'paid',
	paid_by : 'cash',
    created_by :req.decoded.id,
  });

  let promise = mPayment.save();

  promise.then(function(doc){
	  
	  
	  if(req.body.invoice_type == 'outdoor'){
		  
		  Outdoor.findById(req.body.invoice_id).exec()
    .then(docs => {
			
			let pay = docs.invoice.pay;
			let remaining = docs.invoice.remaining;
			let status = docs.invoice.status;
			
			pay = +pay + +req.body.amount ;
			remaining = +remaining - req.body.amount ; 
			if(remaining > 0 ){
				status = 'due';
			}else
			{
				status = 'paid';
			}
			
			
			 Outdoor.updateOne({ _id: req.body.invoice_id }, { $set: {'invoice.pay': pay,'invoice.remaining':remaining,'invoice.status':status} })
				.exec()
				.then(result => {
				   return res.status(201).json({message:"Payment Successfully Added"});
			})
			.catch(err => {
			  console.log(err);
			  res.status(500).json({
				error: err
			  });
			});
			
			
		
		})
    .catch(err => {
      console.log(err);
      res.status(501).json({
        error: err
      });
    });
		  
		  
	  }else{
		  
		  
		   Indoor.findById(req.body.invoice_id).exec()
    .then(docs => {
			
			let pay = docs.invoice.pay;
			let remaining = docs.invoice.remaining;
			let status = docs.invoice.status;
			
			pay = +pay + +req.body.amount ;
			remaining = +remaining - req.body.amount ; 
			if(remaining > 0 ){
				status = 'due';
			}else
			{
				status = 'paid';
			}
			
			
			 Indoor.updateOne({ _id: req.body.invoice_id }, { $set: {'invoice.pay': pay,'invoice.remaining':remaining,'invoice.status':status} })
				.exec()
				.then(result => {
				   return res.status(201).json({message:"Payment Successfully Added"});
			})
			.catch(err => {
			  console.log(err);
			  res.status(500).json({
				error: err
			  });
			});
			
			
		
		})
    .catch(err => {
      console.log(err);
      res.status(501).json({
        error: err
      });
    });
		  
		  
		  
	  }
	  

	  
   
  })

  promise.catch(function(err){
    return res.status(500).json(err)
  })
	
	
	
	
	
	
	
	
	
	
	
};


