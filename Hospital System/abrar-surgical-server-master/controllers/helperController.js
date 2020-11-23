const Charges = require('../models/charges');
const Patient = require('../models/patient');
//const ChargesCategory = require('../models/charges-category');
const { check, validationResult } = require('express-validator/check');
const Outdoor = require('../models/outdoor');
const Indoor = require('../models/indoor');
const Rooms = require('../models/room');
const DailyCharges = require('../models/daily-charges');
const request = require('request');
var fs = require('fs');



exports.sms = function(req, res) {
	
	
	let url = 'https://pk.eocean.us/APIManagement/API/RequestAPI?user=asandadc&pwd=AEnGH5orIhfYSAA6aJHvV2B5oD4vUVGfd3FH3eEaZgOAODUxbK5TY7gNolgVINJg4g%3d%3d&sender=AS%20and%20ADC&response=string';
	let num = '&reciever='+req.body.number;
    let mess = '&msg-data='+req.body.message;
	
	
	let sms = url+num+mess;
	
	
   request(sms, function (error, response, body) {
  //console.log('error:', error); // Print the error if one occurred
  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
  
  
});

return res.status(201).json({message:"SMS Successfully Sent"});

};

exports.dashboard = async function(req, res) {
	
	let patients_count = await Patient.countDocuments({ status: 'active' }, function (err, count) {
		return count;
	
	});
	
	let patients_indoor = await Indoor.countDocuments({ status: 'active',discharge_status:'true' }, function (err, count) {
		
		return count;
	
	});
	
	let patients_outdoor = await Outdoor.countDocuments({ status: 'active' }, function (err, count) {
		return count;
	
	});
	
	let active_indoor = await Indoor.countDocuments({ discharge_status: 'false' }, function (err, count) {
		return count;
	
	});
	
	let patients_male = await Patient.countDocuments({gender: 'male' }, function (err, count) {
		return count;
	
	});
	
	let patients_female = await Patient.countDocuments({ gender: 'female' }, function (err, count) {
		return count;
	
	});
	
	let patients_age_10 = await Patient.countDocuments({ age: { $gte: 1, $lte: 10 },age_type:'year' }, function (err, count) {
		return count;
	
	});
	
	patients_age_10 = {
		name : '0 - 10',
		value : patients_age_10
	}
	
	let patients_age_20 = await Patient.countDocuments({  age: { $gt: 10, $lte: 20 },age_type:'year' }, function (err, count) {
		return count;
	
	});
	
		patients_age_20 = {
		name : '10 - 20',
		value : patients_age_20
	}
	
	let patients_age_30 = await Patient.countDocuments({  age: { $gt: 20, $lte: 30 },age_type:'year' }, function (err, count) {
		return count;
	
	});
	
		patients_age_30 = {
		name : '20 - 30',
		value : patients_age_30
	}
	
	let patients_age_40= await Patient.countDocuments({  age: { $gt: 30, $lte: 40 },age_type:'year'}, function (err, count) {
		return count;
	
	});
	
		patients_age_40 = {
		name : '30 - 40',
		value : patients_age_40
	}
	
	let patients_age_40_plus = await Patient.countDocuments({  age: { $gt: 40},age_type:'year' }, function (err, count) {
		return count;
	
	});
	
		patients_age_40_plus = {
		name : '40+',
		value : patients_age_40_plus
	}
	



	
	
	let age = [];
	age.push(patients_age_10);
	age.push(patients_age_20);
	age.push(patients_age_30);
	age.push(patients_age_40);
	age.push(patients_age_40_plus);
	
	
	
	
	return res.status(201).json({
		total_patient : patients_count,
		indoor_bill : patients_indoor,
		outdoor_bill : patients_outdoor,
		active_indoor : active_indoor,
		patient_male : patients_male,
		patient_female : patients_female,
		patient_age : age,
	});
	
  
 

};


exports.autoCharges = function(req, res) {
			
			let next_charges_apply = new Date(Date.now() + 1*24*60*60*1000);
			
           Indoor.find({discharge_status:false}, 'next_charges_apply invoice room discharge_status', function (err, results) {
			   console.log(results);
			   
			   let current_date = new Date();
			   
			    (async function(){
					
					
					for ( let i = 0; i < results.length; i++) {
						
						
					let d = results[i];
			   
				   
				   if(current_date >=  d.next_charges_apply){
				   
				   
				   console.log("Charges Applied");
				   
				 
				   
	
				   
				   let total_charges = d.invoice.charges;
				   let room_value =  await Rooms.findById(d.room);
				   let roomCharges = {
					category : 'Room Charges',
					name : room_value.name,
					original_charge : room_value.charges,
					charge : room_value.charges,
					discount : 0,
					total : room_value.charges,
					description : '',
					//created_by : req.decoded.id,
					room : d.room,
					status : 'active',
						
				};
				
				total_charges = total_charges + room_value.charges;
				
				let daily_charges = await DailyCharges.find({status:"active"}).select('name charges');
				let temp_daily_charges = [];
				daily_charges.forEach(function(dd){
					
					let tem = {
					category :'Daily Charges',
					name : dd.name,
					original_charge : dd.charges,
					charge : dd.charges,
					discount : 0,
					total : dd.charges,
					description : '',
					//created_by : req.decoded.id,
					daily_charges_id : dd._id,
					status : 'active',
						
				   }
		   
				total_charges = total_charges + dd.charges;

				temp_daily_charges.push(tem);
				
				})
				
				
				let charges = [];
				charges.push(roomCharges);
				temp_daily_charges.forEach(function(d){
			
			charges.push(d);
			
		})
		
		
		
		
		let remaining  = 0;
		let invoice_status = 'due';
		if(d.invoice.pay >= total_charges ){
			invoice_status = 'paid';
		}
		
		remaining = total_charges - d.invoice.pay;
		
		let grand_total = total_charges - d.invoice.discount;
				
				
				//Save In To Database
				
				
				const id = d._id;
 
				  Indoor.findOneAndUpdate({ _id: id },{
					$set: {
						"next_charges_apply":next_charges_apply,"invoice.status": invoice_status,"invoice.charges": total_charges,"invoice.grand_total": grand_total,"invoice.remaining": remaining
					},
					$push: {charges: charges}
				}, {
					multi: true
				})
					.exec()
					.then(result => {
					  console.log("Successfully");
					})
					.catch(err => {
					  console.log(err);
					  res.status(500).json({
						error: err
					  });
					});
        
			
				  
				   
			   }else{
				   console.log("Ignore");
				   
			   }
			   
					}
			   
			   
			    res.status(200).json({
						  message: 'Charges Applied Successfully',
						 
					  });
			   
			   
			   })();
			   
			   
			   
			   
			   
			
			   
		   });
  


};


exports.sendDiag = async (req, res, next) => {
	
	try {
    outdoorData = await Outdoor.findById(req.params.id)
	.select('patient_id invoice_id charges.consultant_id')
	.populate('charges.consultant_id', 'name')
   .populate('patient_id')
    .exec();
	
	var sendData = {
		'patient' : outdoorData,
		'list' : req.body
	}
	
	
	request.post('http://localhost/erp/web/ajax/api', {
	json: sendData,
	}, (error, res, body) => {
		if (error) {
		console.error(error)
		return
	}
	
	//console.log(body);
	
	})
	
	
	return res.status(201).json({message:"Push Successfully"});
	
	
	
    
  } catch (error) {
    console.log('There was an error: ', error);
  }
	
	

};



exports.getTest = function(req, res) {
	
	
		readJSONFile('./data/patient.json', function (err, json) {
  if(err) { throw err; }
  
  for(var i = 0; i < json.length; i++) {
    var obj = json[i];
	var mCharges = new Patient  (obj);

  let promise = mCharges.save();
  
  promise.then(function(doc){
    console.log("Added Successfully");
  })

  promise.catch(function(err){
    console.log(err);
  })
	
}

console.log("Finish");
  
  
  
  
});
	
	
};



exports.getPatient = function(req, res) {
	
	
	readJSONFile('./data/patient.json', function (err, json) {
  if(err) { throw err; }
  
  for(var i = 0; i < json.length; i++) {
    var obj = json[i];
	var mCharges = new Patient  (obj);

  let promise = mCharges.save();
  
  promise.then(function(doc){
    console.log("Added Successfully");
  })

  promise.catch(function(err){
    console.log(err);
  })
	
}

console.log("Finish");
  
  
  
  
});
	
	
	
	
	
	
};










function readJSONFile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch(exception) {
      callback(exception);
    }
  });
}


