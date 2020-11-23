var MedicalTest = require('../models/medical-test');
const TestCategory = require('../models/test-category');
const { check, validationResult } = require('express-validator/check');




exports.validate = (method) => {
switch (method) {
    case 'create': {
     return [ 
      check('test_name', 'Test name is required').not().isEmpty()
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            MedicalTest.findOne({ 'test_name': value }, (err, resp) => {
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
    check('charges', 'charges parameter is missing').exists().isNumeric().withMessage('charges must be number'),
        check('status').not().isEmpty().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value'),
        check('test_category', 'Test Category is required').not().isEmpty()
        .custom((value, { req }) => {
           return new Promise((resolve, reject) => {
              TestCategory.count({_id: value}, function (err, count){ 
                if(count>0)
                    return resolve();
                else
                    return reject();
            }); 
        });
        }).withMessage((value) => {
        return ('Incorrect test category ID');
      }),
       ]   
    }
    case 'update': {
      return [ 
       check('test_name', 'Test name is required').optional().not().isEmpty()
       .custom((value, { req }) => {
          return new Promise((resolve, reject) => {
             MedicalTest.findOne({ 'test_name': value }, (err, resp) => {
              
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
         check('status').optional().not().isEmpty().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value'),
         check('test_category', 'Test Category is required').optional().not().isEmpty()
         .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
               TestCategory.countDocuments({_id: value}, function (err, count){ 
                 if(count>0)
                     return resolve();
                 else
                     return reject();
             }); 
         });
         }).withMessage((value) => {
         return ('Incorrect test category ID');
       }),
        ]   
     }
  }
}


exports.index = function(req, res) {
	
   
   MedicalTest.find()
   .populate('test_category', 'category_name')
   //.populate('updated_by', 'first_name')
   .select('test_name charges status updated_by')
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
    
    console.log(req.decoded);

    var medicalTest = new MedicalTest  ({
    test_name : req.body.test_name,
    test_category  :req.body.test_category,
    status:req.body.status,
    charges : req.body.charges,
    created_by :req.decoded.id,
  });

  let promise = medicalTest.save();

  promise.then(function(doc){
    return res.status(201).json({message:"Test Successfully Added"});
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
  MedicalTest.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Test Updated Successfully',
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