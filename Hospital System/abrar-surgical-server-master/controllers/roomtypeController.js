var RoomType = require('../models/room-type');
const { check, validationResult } = require('express-validator/check');



exports.validate = (method) => {
switch (method) {
    case 'create': {
     return [ 
        check('name', 'Room Type name is required').exists()
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            RoomType.findOne({ 'name': value }, (err, resp) => {
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
        check('name', 'Room Type name cannot be empty').optional().not().isEmpty()
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            RoomType.findOne({ 'name': value }, (err, resp) => {
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
        check('status').optional().not().isEmpty().withMessage('Status cannot be empty').isIn(['active', 'inactive']).withMessage('Incorrect status value')
       ]   
    }
  }
}


exports.index = function(req, res) {
	
   
   RoomType.find().select('name status')
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
		
		console.log("Hit");
    var Roomtype = new RoomType  ({
    name : req.body.name,
    status:req.body.status,
    created_by :req.decoded.id,
  });

  let promise = Roomtype.save();

  promise.then(function(doc){
    return res.status(201).json({message:"Room Type Successfully Added"});
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
  /* const updateOps = {};
  for (let b in req.body) {
    updateOps[b] = req.body[b];
  } */
  req.body.updated_by  = req.decoded.id;

  RoomType.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Charges Category Updated Successfully',
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
	
   
  RoomType.find({status:"active"}).select('name')
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