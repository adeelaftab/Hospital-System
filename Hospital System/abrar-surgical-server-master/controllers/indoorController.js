var Consultant= require('../models/consultant');
const Payment = require('../models/payment');
const Indoor = require('../models/indoor');
const Rooms = require('../models/room');
const DailyCharges = require('../models/daily-charges');
const { check, validationResult } = require('express-validator/check');
var mongoose = require('mongoose');

exports.validate = (method) => {
switch (method) {
    case 'create': {
     return [ 
    check('consultant_id', 'Consultant is required').exists().not().isEmpty(),
    check('patient_id', 'Patient is Required').exists().not().isEmpty(),
	check('room', 'Room is Required').exists().not().isEmpty(),
    check('status').exists().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value')
       ]    
    }
  }
}


exports.index = function(req, res) {
	
   
   Indoor.find().select('invoice_id created_at status')
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
	
   
   Indoor.findById(req.params.id)
   .populate('patient_id', 'name patient_id age age_type gender contact.mobile_no blood_group')
   .populate('created_by', 'first_name')
   .populate('consultant_id', 'name')
    .populate('room', 'name')
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


exports.getIndoorID = function(req, res) {
	
   console.log(req.param('search'));
   Indoor.find({ 'invoice_id': { $regex: '.*' + req.param('search') + '.*' , $options : 'i' } })
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
	
   
   Indoor.findById(req.params.id)
   .select('charges invoice')
   .populate('charges.room', 'name')
   .populate('charges.daily_charges_id', 'name')
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
 
  Indoor.findOneAndUpdate({ _id: id },{
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
  Indoor.findOneAndUpdate({ _id: id }, {$set: req.body})
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
  Indoor.update({ 'charges._id': id }, {$set: {
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

exports.discharge = function(req, res) {
	
	let todayDate = new Date();
  const id = req.params.id;
  req.body.updated_by = req.decoded.id;
  var query = {'_id':id};
  Indoor.findOneAndUpdate({ _id: id }, {$set: {
	   discharge_status : true,
	  discharge_on : todayDate
  }})
    .exec()
    .then(result => {
		
		(async function(){
			let room_update =  await Rooms.updateOne({ _id: result.room }, { $set: {
			room_status : 'Available'
		} })
		})();
		
		
		
		
      res.status(200).json({
          message: 'Patient Discharge Successfully',
         
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
			criteria.$and.push({ 'consultant_id': search_consultant})
		}
		
	
		if(search_payment_status){
			var regex = new RegExp(search_payment_status, "i")
			criteria.$and.push({ 'invoice.status': regex})
		}
		
		
	}
	
	

    var recordsTotal = 0;
    var recordsFiltered=0;
    
    Indoor.count({}, function(err, c) {
        recordsTotal=c;
        console.log(c);
        Indoor.count(criteria, function(err, c) {
            recordsFiltered=c;
            console.log(c);
            console.log(req.body.start);
            console.log(req.body.length);
                Indoor.find(criteria, 'invoice_id patient_id invoice created_at discharge_status discharge_on',{'populate':   [ { path: 'patient_id'}, { path: 'consultant_id'}],'order':req.body.order ,'skip': Number( req.body.start), 'limit': Number(req.body.length) }, function (err, results) {
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

exports.activedataTable = function(req,res){
	
	let now = new Date();
	//let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	
	
	
	var search_invoice_id = req.body.invoice_id;
	var search_patient_id = req.body.patient_id;
	var search_patient_name = req.body.patient_name;
	var search_patient_phone = req.body.patient_phone;
	var search_payment_status = req.body.payment_status;
	var search_consultant = req.body.consultant;
	
	
	
	const criteria = {status: 'active','discharge_status':false};
	
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
    
    Indoor.count({}, function(err, c) {
        recordsTotal=c;
        console.log(c);
        Indoor.count(criteria, function(err, c) {
            recordsFiltered=c;
            console.log(c);
            console.log(req.body.start);
            console.log(req.body.length);
                Indoor.find(criteria, 'invoice_id patient_id  invoice created_at discharge_on discharge_status next_charges_apply',{'populate':   [ { path: 'patient_id'}, { path: 'room'}, { path: 'consultant_id'}],'order':req.body.order ,'skip': Number( req.body.start), 'limit': Number(req.body.length) }, function (err, results) {
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
 
   Indoor.findOne().select('invoice_id -_id').sort({'_id': -1})
    .exec()
    .then(docs => {
		 let p_id = 'ASID-100';
		if(docs){
			var str = docs.invoice_id;
			var res = str.split("-");
			p_id = parseInt(res[1]);
			p_id++;
			return "ASID-"+p_id;
		}else
		{
			return p_id;
		}
		
    })
    .then(result => {
		
		req.body.invoice_id = result;
		
		
		(async function(){
			
		let total_charges = 0;
		
		let room_value =  await Rooms.findById(req.body.room);
		
		
		
		
		let roomCharges = {
			category : 'Room Charges',
			name : room_value.name,
			original_charge : room_value.charges,
			charge : room_value.charges,
			discount : 0,
			total : room_value.charges,
			description : '',
			created_by : req.decoded.id,
			room : req.body.room,
			status : 'active',
						
		};
		
		total_charges = total_charges + room_value.charges;
		
		let daily_charges = await DailyCharges.find({status:"active"}).select('name charges');
		  let temp_daily_charges = [];
		daily_charges.forEach(function(d){
			
			let tem = {
			category :'Daily Charges',
            name : d.name,
			original_charge : d.charges,
			charge : d.charges,
			discount : 0,
			total : d.charges,
			description : '',
			created_by : req.decoded.id,
			daily_charges_id : d._id,
			status : 'active',
				
           }
		   
		   total_charges = total_charges + d.charges;

             temp_daily_charges.push(tem);
        
		})
		
		let remaining  = 0;
		let invoice_status = 'due';
		if(req.body.payment.advanced >= total_charges ){
			invoice_status = 'paid';
			remaining = total_charges - req.body.payment.advanced;
		}else{
			remaining = total_charges - req.body.payment.advanced;
		}
		
		
		let next_charges_apply = new Date(Date.now() + 1*24*60*60*1000);
		var saveData = new Indoor({
		invoice_id : req.body.invoice_id,
		created_by : req.decoded.id,
		patient_id : req.body.patient_id,
		consultant_id : req.body.consultant_id,
		room : req.body.room,
		invoice: {
			
			consultant_amount : 0,
			hospital_amount : 0,
			charges: total_charges,
			discount : 0,
			grand_total : total_charges,
			advanced : +req.body.payment.advanced,
			pay : +req.body.payment.advanced,
			remaining : remaining,
			refund : 0,
			status : invoice_status,
			
		},
		next_charges_apply : next_charges_apply ,
		status : req.body.status,
		});
		
		saveData.charges.push(roomCharges);
		
		temp_daily_charges.forEach(function(d){
			
			saveData.charges.push(d);
			
		})
		
		
		
		let promise = saveData.save();
		
		 promise.then(function
	  (doc){
		
		var pay  = new Payment({
			
			invoice_type : 'Indoor',
			invoice_id: doc._id,
			patient_id : doc.patient_id,
			payment_type : 'advanced',
			amount : doc.invoice.pay,
			paid_by : 'cash',
			status : 'active',
			created_by : doc.created_by,
			
		});
		
		let prom = pay.save();
		
		(async function(){
			let room_update =  await Rooms.updateOne({ _id: req.body.room }, { $set: {
			room_status : 'Occupied',
			indoor : doc._id
		} })
		})();
	
		
		return res.status(201).json({message:"Indoor Patient Successfully Registerd",indoor:{
			id : doc._id
		}});
	  })

	  promise.catch(function(err){
		return res.status(500).json(err)
	  })
		
		
		
		})();
		
	 
		 
    });
	

};

