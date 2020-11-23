const DailyCharges = require('../models/daily-charges');
const { check, validationResult } = require('express-validator/check');




exports.validate = (method) => {
switch (method) {
    case 'create': {
     return [ 
      check('name', 'Charges name is required').not().isEmpty()
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            DailyCharges.findOne({ 'name': value }, (err, resp) => {
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
        check('status').not().isEmpty().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value')
       ]   
    }
    case 'update': {
      return [ 
       check('name', 'Charges name is required').optional().not().isEmpty()
       .custom((value, { req }) => {
          return new Promise((resolve, reject) => {
             DailyCharges.findOne({ 'charges_name': value }, (err, resp) => {
              
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
        ]   
     }
  }
}


exports.index = function(req, res) {
	
   
   DailyCharges.find()
   //.populate('updated_by', 'first_name')
   .select('name charges status updated_by')
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

    var mCharges = new DailyCharges  ({
    name : req.body.name,
    status:req.body.status,
    charges : req.body.charges,
    created_by :req.decoded.id,
  });

  let promise = mCharges.save();

  promise.then(function(doc){
    return res.status(201).json({message:"Charges Successfully Added"});
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
  DailyCharges.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Charges Updated Successfully',
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


exports.dataTable = function(req,res){
	console.log(req.body.columns);
	DailyCharges.dataTables({
    limit: req.body.length,
    skip: req.body.start,
	select : ('name charges status updated_by'),
	//find:{ $or:[ {'status':'inactive'}, {'name':'farhan'} ]},
	find:{'status':'active'},
	search: {
      value: req.body.search.value,
      fields: ['name']
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

};