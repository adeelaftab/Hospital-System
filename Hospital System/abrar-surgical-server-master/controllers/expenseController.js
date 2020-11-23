var Expense = require('../models/expense');
var ExpenseCategory = require('../models/expense-category');
const { check, validationResult } = require('express-validator/check');



exports.validate = (method) => {
switch (method) {
    case 'create': {
     return [ 
        check('amount', 'Expense amount is required').exists(),
		check('category', 'Expense Category is required').not().isEmpty()
        .custom((value, { req }) => {
           return new Promise((resolve, reject) => {
              ExpenseCategory.countDocuments({_id: value}, function (err, count){ 
                if(count>0)
                    return resolve();
                else
                    return reject();
            }); 
        });
        }).withMessage((value) => {
        return ('Incorrect Expense Category ID');
      }),
        check('status').exists().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value')
       ]   
    }
	break;
	case 'update': {
     return [ 
        check('amount', 'Expense Amount cannot be empty').optional().not().isEmpty(),
		check('categoey', 'Expense Category is required').optional().not().isEmpty()
         .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
               ExpenseCategory.countDocuments({_id: value}, function (err, count){ 
                 if(count>0)
                     return resolve();
                 else
                     return reject();
             }); 
         });
         }).withMessage((value) => {
         return ('Incorrect Expense Category ID');
       }),
        check('status').optional().not().isEmpty().withMessage('Status cannot be empty').isIn(['active', 'inactive']).withMessage('Incorrect status value')
       ]   
    }
  }
}


exports.index = function(req, res) {
	
   
 Expense.find()
   .populate('category', 'category_name')
   //.populate('updated_by', 'first_name')
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

  
    req.body.created_by = req.decoded.id;
    Expense.findOne().select('expense_id -_id').sort({'expense_id': -1})
    .exec()
    .then(docs => {
		 let p_id = 'ASEXP-100';
		if(docs){
			var str = docs.expense_id;
			var res = str.split("-");
			p_id = parseInt(res[1]);
			p_id++;
			return "ASEXP-"+p_id;
		}else
		{
			return p_id;
		}
		
    })
    .then(result => {
		
		req.body.expense_id = result;
		 
		 var spec = new Expense  (req.body);

		let promise = spec.save();

	  promise.then(function(doc){
		return res.status(201).json({message:"Expense Successfully Added"});
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
  /* const updateOps = {};
  for (let b in req.body) {
    updateOps[b] = req.body[b];
  } */
  req.body.updated_by  = req.decoded.id;

  Expense.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Expense Updated Successfully',
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
	Expense.dataTables({
    limit: req.body.length,
    skip: req.body.start,
	populate : ('category created_by'),
	//find:{ $or:[ {'status':'inactive'}, {'name':'farhan'} ]},
	search: {
      value: req.body.search.value,
      fields: ['note','expense_id']
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

exports.active = function(req, res) {
	
   
  Expense.find({status:"active"})
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