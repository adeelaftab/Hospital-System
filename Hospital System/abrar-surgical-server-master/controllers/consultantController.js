var Consultant= require('../models/consultant');
const Specialization = require('../models/specialization');
const { check, validationResult } = require('express-validator/check');



exports.validate = (method) => {
switch (method) {
    case 'create': {
     return [ 
        check('name', 'Consultant name is required').exists()
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            Consultant.findOne({ 'name': value }, (err, resp) => {
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
    check('address', 'address parameter is missing').exists(),
    check('email', 'email parameter is missing').exists(),
    check('office_no', 'office_no parameter is missing').exists(),
    check('mobile_no', 'mobile_ no parameter is missing').exists(),
    check('charges.normal', 'charges.normal parameter is missing').exists().isNumeric().withMessage('charges.normal must be number'),
    check('charges.first_time', 'charges.first_time must be number').optional({checkFalsy: true}).isNumeric(),
    check('charges.seven_days', 'charges.seven_days must be number').optional({checkFalsy: true}).isNumeric(),
    check('consultant_type', 'consultant_type parameter is missing').exists().isIn(['','indoor', 'outdoor']).withMessage('Incorrect type value'),
    check('specialization', 'specialization parameter is missing').exists().isArray().withMessage('specialization must be array')
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        value.forEach(function(value){
          Specialization.countDocuments({_id: value}, function (err, count){ 
            if(count>0)
                return resolve();
            else
                return reject();
        });
        });
        
   });
   }).withMessage((value) => {
   return ('Incorrect specialization value');
 }),
    check('status').exists().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value')
       ]   
    }
	break;
	case 'update': {
     return [ 
        check('name', 'Consultant name cannot be empty').exists().not().isEmpty()
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            Consultant.findOne({ 'name': value }, (err, resp) => {
               if(resp !== null) {
				   console.log(resp.id);
				    if (resp.id == req.params.id)
					   return resolve();
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
         check('address', 'address parameter is missing').exists(),
    check('email', 'email parameter is missing').exists(),
    check('office_no', 'office_no parameter is missing').exists(),
    check('mobile_no', 'mobile_ no parameter is missing').exists(),
    check('charges.normal', 'charges.normal parameter is missing').exists().isNumeric().withMessage('charges.normal must be number'),
    check('charges.first_time', 'charges.first_time must be number').optional({checkFalsy: true}).isNumeric(),
    check('charges.seven_days', 'charges.seven_days must be number').optional({checkFalsy: true}).isNumeric(),
    check('consultant_type', 'consultant_type parameter is missing').exists().isIn(['','indoor', 'outdoor']).withMessage('Incorrect type value'),
    check('specialization', 'specialization parameter is missing').exists().isArray().withMessage('specialization must be array')
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        value.forEach(function(value){
          Specialization.countDocuments({_id: value}, function (err, count){ 
            if(count>0)
                return resolve();
            else
                return reject();
        });
        });
        
   });
   }).withMessage((value) => {
   return ('Incorrect specialization value');
 }),
    check('status').exists().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value')
       ]   
    }
  }
}


exports.index = function(req, res) {
	
   
   Consultant.find().select('name consultant_type charges status hospital_share ')
   .populate('specialization', 'name _id:0')
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

exports.view = function(req, res) {
	
   
   Consultant.findById(req.params.id).select('name consultant_type charges address email mobile_no office_no status hospital_share ')
   .populate('specialization', 'name _id:0')
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

exports.getConsultantList = function(req, res) {
	
	
	   Consultant.find({ 'name': { $regex: '.*' + req.param('search') + '.*' , $options : 'i' } })
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

exports.getupdate = function(req, res) {
	
   
   Consultant.findById(req.params.id).select('name specialization mobile_no office_no address email consultant_type status charges hospital_share -_id')
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

  var spec = new Consultant  (req.body);

  let promise = spec.save();

  promise.then(function(doc){
    return res.status(201).json({message:"Consultant Successfully Added"});
  })

  promise.catch(function(err){
    return res.status(500).json(err)
  })
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
  Consultant.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Consultant Updated Successfully',
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

exports.active = function(req, res) {
	
   
  Consultant.find({status:"active"}).select('name charges hospital_share')
   .exec()
   .then(docs => {
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