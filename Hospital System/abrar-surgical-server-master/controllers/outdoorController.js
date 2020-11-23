var Consultant= require('../models/consultant');
const Payment = require('../models/payment');
const Outdoor = require('../models/outdoor');
const { check, validationResult } = require('express-validator/check');
var mongoose = require('mongoose');

exports.validate = (method) => {
switch (method) {
    case 'create': {
     return [ 
    check('charges.consultant.consultant_id', 'Consultant is required').exists().not().isEmpty(),
	check('charges.consultant.fee_type', 'Fee Type is required').exists().not().isEmpty(),
	check('charges.consultant.fee', 'Consultant Fee is Required').exists().not().isEmpty(),
    check('patient_id', 'Patient is Required').exists().not().isEmpty(),
    check('status').exists().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value')
       ]    
    }
  }
}


exports.index = function(req, res) {
	
   
   Outdoor.find().select('invoice_id created_at status')
   .populate('patient_id', 'name patient_id age gender contact.mobile_no')
    .exec()
    .then(docs => {
      
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

exports.view = function(req, res) {
	
   
   Outdoor.findById(req.params.id)
   .populate('patient_id', 'name patient_id age age_type gender contact.mobile_no blood_group')
   .populate('created_by', 'first_name')
   .populate('charges.consultant_id', 'name')
   .populate('charges.charges_id', 'category')
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


exports.getOutdoorID = function(req, res) {
	
   console.log(req.param('search'));
   Outdoor.find({ 'invoice_id': { $regex: '.*' + req.param('search') + '.*' , $options : 'i' } })
   .select('invoice_id')
   .limit(10)
    .exec()
    .then(docs => {
      console.log(docs);
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


exports.viewCharges = function(req, res) {
	
   
   Outdoor.findById(req.params.id)
   .select('charges invoice')
   .populate('charges.consultant_id', 'name')
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

exports.addCharges = function(req, res) {
	
	
  const id = req.params.id;
 
  Outdoor.findOneAndUpdate({ _id: id },{
    $set: {
        "invoice.status": req.body.status,"invoice.charges": req.body.charges,"invoice.discount": req.body.discount,"invoice.grand_total": req.body.grand_total,"invoice.remaining": req.body.remaining
    },
    $push: {charges: req.body.list}
}, {
    multi: true
})
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Charges Applied Successfully',
         
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
	
	
};



exports.update = function(req, res) {
	
	
  const id = req.params.id;
  req.body.updated_by = req.decoded.id;
  console.log("Update");
  console.log(req.body);
  var query = {'_id':id};
  Outdoor.findOneAndUpdate({ _id: id }, {$set: req.body})
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Updated Successfully',
         
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
	
};

exports.updateCharges = function(req, res) {
	
	
  const id = req.params.id;
  req.body.updated_by = req.decoded.id;
  console.log("Update");
  console.log(req.body);
  Outdoor.update({ 'charges._id': id }, {$set: {
	  'charges.$.updated_by' : req.decoded.id,
	  'charges.$.charge': parseInt(req.body.charges),
	  'charges.$.discount' : parseInt(req.body.discount),
	  'charges.$.total' : parseInt(req.body.charges - req.body.discount),
	  'charges.$.status' : req.body.status,
  }})
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Updated Successfully',
         
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
	
};

exports.dataTable = function(req,res){
	
	/*console.log(req.body.columns);
	Outdoor.dataTables({
    limit: req.body.length,
    skip: req.body.start,
	populate : ('charges.consultant_id patient_id'),
	//find:{ $or:[ {'status':'inactive'}, {'name':'farhan'} ]},
	find:{'status':'active'},
	search: {
      value: req.body.search.value,
      fields: ['invoice_id']
    },
    order: req.body.order,
    columns: req.body.columns
  }).then(function (table) {
    res.json({
      data: table.data,
      recordsFiltered: table.total,
      recordsTotal: table.total
    });
  });*/
  
  var search_invoice_id = req.body.invoice_id;
	var search_patient_id = req.body.patient_id;
	var search_patient_name = req.body.patient_name;
	var search_patient_phone = req.body.patient_phone;
	var search_payment_status = req.body.payment_status;
	var search_consultant = req.body.consultant;
	
	
	
	const criteria = {status: 'active'};
	
	if(search_invoice_id || search_patient_id || search_patient_name || search_patient_phone){
		
		criteria.$or = [];
		
		if(search_invoice_id)
		{
			
			
			var regex = new RegExp(search_invoice_id, "i")
			criteria.$or.push({ invoice_id: regex})
           
		}else if(search_patient_name){
			
			search_patient_name = mongoose.Types.ObjectId(search_patient_name);
			criteria.$or.push({ patient_id: search_patient_name})
			
			
		}else if(search_patient_id){
			search_search_patient_id = mongoose.Types.ObjectId(search_patient_id);
			criteria.$or.push({ patient_id: search_patient_id})
		}else if(search_patient_phone){
			search_patient_phone = mongoose.Types.ObjectId(search_patient_phone);
			criteria.$or.push({ patient_id: search_patient_phone})
		}
		
	}
	
	
	if(search_consultant || search_payment_status ){
			criteria.$and = [];
			
		
		
			
		
		
		if(search_consultant){
			search_consultant = mongoose.Types.ObjectId(search_consultant);
			criteria.$and.push({ 'charges.consultant_id': search_consultant})
		}
		
	
		if(search_payment_status){
			var regex = new RegExp(search_payment_status, "i")
			criteria.$and.push({ 'invoice.status': regex})
		}
		
		
	}
	
	

    var recordsTotal = 0;
    var recordsFiltered=0;
    
    Outdoor.count({}, function(err, c) {
        recordsTotal=c;
        console.log(c);
        Outdoor.count(criteria, function(err, c) {
            recordsFiltered=c;
            console.log(c);
            console.log(req.body.start);
            console.log(req.body.length);
                Outdoor.find(criteria, 'invoice_id patient_id charges invoice created_at',{'populate':   [ { path: 'patient_id'}, { path: 'charges.consultant_id'}],'order':req.body.order ,'skip': Number( req.body.start), 'limit': Number(req.body.length) }, function (err, results) {
                    if (err) {
                        console.log('error while getting results'+err);
                        return;
                    }
            
                    var data = JSON.stringify({
                        "draw": req.body.draw,
                        "recordsFiltered": recordsFiltered,
                        "recordsTotal": recordsTotal,
                        "data": results
                    });
                    res.send(data);
                });
        
          });
   });
  
  
  
  
  
  

};

exports.todaydataTable = function(req,res){
	
	let now = new Date();
	let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	console.log(req.body.columns);
	/*Outdoor.dataTables({
    limit: req.body.length,
    skip: req.body.start,
	
	populate :   [ { path: 'patient_id',match: { name: 'Farhan' }}, { path: 'charges.consultant_id'}],
	//find:{ $or:[ {'status':'inactive'}, {'name':'farhan'} ]},
	find:{'status':'active','created_at':{$gte: startOfToday}},
	search: {
      value: req.body.search.value,
      fields: ['patient_id.name']
    },
    order: req.body.order,
    columns: req.body.columns
  }).then(function (table) {
    res.json({
      data: table.data,
      recordsFiltered: table.total,
      recordsTotal: table.total
    });
  });*/
  
    //var searchStr = req.body.search.value;
	
	
	var search_invoice_id = req.body.invoice_id;
	var search_patient_id = req.body.patient_id;
	var search_patient_name = req.body.patient_name;
	var search_patient_phone = req.body.patient_phone;
	var search_payment_status = req.body.payment_status;
	var search_consultant = req.body.consultant;
	
	
	
	const criteria = {status: 'active','created_at':{$gte: startOfToday}};
	
	if(search_invoice_id || search_patient_id || search_patient_name || search_patient_phone){
		
		criteria.$or = [];
		
		if(search_invoice_id)
		{
			
			
			var regex = new RegExp(search_invoice_id, "i")
			criteria.$or.push({ invoice_id: regex})
           
		}else if(search_patient_name){
			
			search_patient_name = mongoose.Types.ObjectId(search_patient_name);
			criteria.$or.push({ patient_id: search_patient_name})
			
			
		}else if(search_patient_id){
			search_search_patient_id = mongoose.Types.ObjectId(search_patient_id);
			criteria.$or.push({ patient_id: search_patient_id})
		}else if(search_patient_phone){
			search_patient_phone = mongoose.Types.ObjectId(search_patient_phone);
			criteria.$or.push({ patient_id: search_patient_phone})
		}
		
	}
	
	
	if(search_consultant || search_payment_status ){
			criteria.$and = [];
			
		
		
			
		
		
		if(search_consultant){
			search_consultant = mongoose.Types.ObjectId(search_consultant);
			criteria.$and.push({ 'charges.consultant_id': search_consultant})
		}
		
	
		if(search_payment_status){
			var regex = new RegExp(search_payment_status, "i")
			criteria.$and.push({ 'invoice.status': regex})
		}
		
		
	}
	
	

    var recordsTotal = 0;
    var recordsFiltered=0;
    
    Outdoor.count({}, function(err, c) {
        recordsTotal=c;
        console.log(c);
        Outdoor.count(criteria, function(err, c) {
            recordsFiltered=c;
            console.log(c);
            console.log(req.body.start);
            console.log(req.body.length);
                Outdoor.find(criteria, 'invoice_id patient_id charges invoice created_at',{'populate':   [ { path: 'patient_id'}, { path: 'charges.consultant_id'}],'order':req.body.order ,'skip': Number( req.body.start), 'limit': Number(req.body.length) }, function (err, results) {
                    if (err) {
                        console.log('error while getting results'+err);
                        return;
                    }
            
                    var data = JSON.stringify({
                        "draw": req.body.draw,
                        "recordsFiltered": recordsFiltered,
                        "recordsTotal": recordsTotal,
                        "data": results
                    });
                    res.send(data);
                });
        
          });
   });
  
  
  
  

};


exports.create = function(req, res ,  next) {
	
	const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
    }
    

  
  
  //Generate Invoice ID Unique
  
  //Get Last  ID and Increment It
 
   Outdoor.findOne().select('invoice_id -_id').sort({'_id': -1})
    .exec()
    .then(docs => {
		 let p_id = 'ASOD-100';
		if(docs){
			var str = docs.invoice_id;
			var res = str.split("-");
			p_id = parseInt(res[1]);
			p_id++;
			return "ASOD-"+p_id;
		}else
		{
			return p_id;
		}
		
    })
    .then(result => {
		
		req.body.invoice_id = result;
		
		//Orangize Data Later Work
		
		
		var consultant_data = {
		category : 'Consultant',
		consultant_id : req.body.charges.consultant.consultant_id,
		charge : req.body.charges.consultant.fee,
		charge_type : req.body.charges.consultant.fee_type,
		discount : req.body.payment.discount,
		total : req.body.payment.grand_total,
		created_by : req.decoded.id,
		status : 'active',
		};
		
		 var saveData = new Outdoor({
		invoice_id : req.body.invoice_id,
		created_by : req.decoded.id,
		patient_id : req.body.patient_id,
		invoice: {
			
			consultant_amount : +req.body.payment.consulant_amount,
			hospital_amount : +req.body.payment.hospital_amount,
			charges: +req.body.payment.total,
			discount : +req.body.payment.discount,
			grand_total : +req.body.payment.grand_total,
			pay : +req.body.payment.pay,
			remaining : req.body.payment.remaining,
			refund : 0,
			status : req.body.payment.status,
			
		},
		status : req.body.status,
		});
		
		saveData.charges.push(consultant_data);
		
		let promise = saveData.save();

	  promise.then(function
	  (doc){
		
		var pay  = new Payment({
			
			invoice_type : 'outdoor',
			invoice_id: doc._id,
			patient_id : doc.patient_id,
			payment_type : 'paid',
			amount : doc.invoice.pay,
			paid_by : 'cash',
			status : 'active',
			created_by : doc.created_by,
			
		});
		
		let prom = pay.save();
		
		return res.status(201).json({message:"Outdoor Patient Successfully Registerd",outdoor:{
			id : doc._id
		}});
	  })

	  promise.catch(function(err){
		return res.status(500).json(err)
	  })
		 
		 
		 
		 
    });
	

};

