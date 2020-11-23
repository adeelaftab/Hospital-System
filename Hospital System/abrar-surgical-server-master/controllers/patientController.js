var Consultant= require('../models/consultant');
const Patient = require('../models/patient');
const Outdoor = require('../models/outdoor');
const Indoor = require('../models/indoor');
const { check, validationResult } = require('express-validator/check');



exports.validate = (method) => {
switch (method) {
    case 'create': {
     return [ 
    check('name', 'name parameter is missing').exists(),
	check('gender', 'gender parameter is missing').exists(),
	check('age', 'age parameter is missing').exists(),
    check('address.country', 'address.country parameter is missing').exists(),
	check('contact.mobile_no', 'Mobile Number is required').not().isEmpty()
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            Patient.findOne({ 'contact.mobile_no': value }, (err, resp) => {
               if(resp !== null) {
                  return reject();
               } else {
                  return resolve();
               }
            });
			});
			}).withMessage((value) => {
			return (value+' is already added');
    }),
	check('cnic', 'Cnic Parameter Required').optional({checkFalsy: true})
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            Patient.findOne({ 'cnic': value }, (err, resp) => {
               if(resp !== null) {
                  return reject();
               } else {
                  return resolve();
               }
            });
			});
			}).withMessage((value) => {
			return (value+' CNIC is already added');
    }),
	check('passport', 'Passport Parameter Required').optional({checkFalsy: true})
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            Patient.findOne({ 'passport': value }, (err, resp) => {
               if(resp !== null) {
                  return reject();
               } else {
                  return resolve();
               }
            });
			});
			}).withMessage((value) => {
			return (value+' is already added');
    }),
    check('status').exists().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value')
       ]   
    }
	break;
	case 'update': {
     return [ 
    check('name', 'name parameter is missing').exists(),
	check('gender', 'gender parameter is missing').exists(),
	check('age', 'age parameter is missing').exists(),
    check('address.country', 'address.country parameter is missing').exists(),
	check('contact.mobile_no', 'Mobile Number is required').not().isEmpty()
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            Patient.findOne({ 'contact.mobile_no': value }, (err, resp) => {
               if(resp !== null) {
                  
                  if (resp.id == req.params.id){
                 
                    return resolve();
                  }
                  else
                   return reject();
                } else {
                  
                   return resolve();
                }
            });
			});
			}).withMessage((value) => {
			return (value+' is already added');
    }),
	check('cnic', 'Cnic Parameter Required').optional({checkFalsy: true})
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            Patient.findOne({ 'cnic': value }, (err, resp) => {
              if(resp !== null) {
                  
                  if (resp.id == req.params.id){
                 
                    return resolve();
                  }
                  else
                   return reject();
                } else {
                  
                   return resolve();
                }
            });
			});
			}).withMessage((value) => {
			return (value+' CNIC is already added');
    }),
	check('passport', 'Passport Parameter Required').optional({checkFalsy: true})
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            Patient.findOne({ 'passport': value }, (err, resp) => {
              if(resp !== null) {
                  
                  if (resp.id == req.params.id){
                 
                    return resolve();
                  }
                  else
                   return reject();
                } else {
                  
                   return resolve();
                }
            });
			});
			}).withMessage((value) => {
			return (value+' is already added');
    }),
    //check('status').exists().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value')
       ]   
    }
  }
}


exports.index = function(req, res) {
	
   Patient.find().select('name patient_id age gender status contact.mobile_no address.city ')
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


exports.dataTable = function(req,res){
	console.log(req.body.columns);
	Patient.dataTables({
    limit: req.body.length,
    skip: req.body.start,
	//find:{ $or:[ {'status':'inactive'}, {'name':'farhan'} ]},
	search: {
      value: req.body.search.value,
      fields: ['patient_id','name','age','gender','contact.mobile_no']
    },
    order: req.body.order,
    columns: req.body.columns
  }).then(function (table) {
    res.json({
      data: table.data,
      recordsFiltered: table.total,
      recordsTotal: table.total
    });
  });
  
    /*var searchStr = req.body.search.value;
    if(req.body.search.value)
    {
            var regex = new RegExp(req.body.search.value, "i")
            searchStr = { $or: [{'name': regex},{'patient_id': regex},{'age': regex }] };
    }
    else
    {
         searchStr={};
    }

    var recordsTotal = 0;
    var recordsFiltered=0;
    
    Patient.count({}, function(err, c) {
        recordsTotal=c;
        console.log(c);
        Patient.count(searchStr, function(err, c) {
            recordsFiltered=c;
            console.log(c);
            console.log(req.body.start);
            console.log(req.body.length);
                Patient.find(searchStr, 'name patient_id gender contact.mobile_no status age',{'order':req.body.order ,'skip': Number( req.body.start), 'limit': Number(req.body.length) }, function (err, results) {
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
   });*/
   
     
  
  
  
  
  
}

exports.view = function(req, res) {
	
   console.log(req.params.id);
   Patient.findById(req.params.id)
   .populate('created_by', 'name')
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


exports.getPatientName = function(req, res) {
	
   console.log(req.param('search'));
   Patient.find({ 'name': { $regex: '.*' + req.param('search') + '.*' , $options : 'i' } })
   .select('name')
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

exports.getPatientID = function(req, res) {
	
   console.log(req.param('search'));
   Patient.find({ 'patient_id': { $regex: '.*' + req.param('search') + '.*' , $options : 'i' } })
   .select('patient_id')
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

exports.getPatientMobileNumber = function(req, res) {
	
   console.log(req.param('search'));
   Patient.find({ 'contact.mobile_no': { $regex: '.*' + req.param('search') + '.*' , $options : 'i' } })
   .select('contact.mobile_no')
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

exports.create = function(req, res ,  next) {
	
	const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
    }
    

  req.body.created_by = req.decoded.id
  
  //Generate Patient ID Unique
  
  //Get Last Patient ID and Increment It
 
   Patient.findOne().select('patient_id -_id').sort({'patient_id': -1})
    .exec()
    .then(docs => {
		 let p_id = 'AS-100';
		if(docs){
			var str = docs.patient_id;
			var res = str.split("-");
			p_id = parseInt(res[1]);
			p_id++;
			return "AS-"+p_id;
		}else
		{
			return p_id;
		}
		
    })
    .then(result => {
		
		req.body.patient_id = result;
		 
		 var spec = new Patient  (req.body);

		let promise = spec.save();

	  promise.then(function(doc){
		return res.status(201).json({message:"Patient Successfully Added",patient:{
			id : doc._id
		}});
	  })

	  promise.catch(function(err){
		return res.status(500).json(err)
	  })
		 
		 
		 
		 
    });
	

};

exports.update = function(req, res) {
	
	const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

	
  const id = req.params.id;
  req.body.updated_by = req.decoded.id;
  /* const updateOps = {};
  for (let b in req.body) {
    updateOps[b] = req.body[b];
  } */
  Patient.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Patient Updated Successfully',
         /* request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + id
          } */
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
	
};

