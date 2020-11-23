const Rooms = require('../models/room');
const RoomCategory = require('../models/room-type');
const { check, validationResult } = require('express-validator/check');




exports.validate = (method) => {
switch (method) {
    case 'create': {
     return [ 
      check('name', 'Room name is required').not().isEmpty()
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            Rooms.findOne({ 'name': value }, (err, resp) => {
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
        check('room_type', 'Room Type is required').not().isEmpty()
        .custom((value, { req }) => {
           return new Promise((resolve, reject) => {
              RoomCategory.count({_id: value}, function (err, count){ 
                if(count>0)
                    return resolve();
                else
                    return reject();
            }); 
        });
        }).withMessage((value) => {
        return ('Incorrect room_type ID');
      }),
       ]   
    }
    case 'update': {
      return [ 
       check('name', 'Room name is required').optional().not().isEmpty()
       .custom((value, { req }) => {
          return new Promise((resolve, reject) => {
             Rooms.findOne({ 'charges_name': value }, (err, resp) => {
              
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
         check('room_type', 'room_type is required').optional().not().isEmpty()
         .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
               RoomCategory.countDocuments({_id: value}, function (err, count){ 
                 if(count>0)
                     return resolve();
                 else
                     return reject();
             }); 
         });
         }).withMessage((value) => {
         return ('Incorrect room_type ID');
       }),
        ]   
     }
  }
}


exports.index = function(req, res) {
	
   
   Rooms.find()
   .populate('room_type', 'name')
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

    var mRoom = new Rooms  ({
    name : req.body.name,
    room_type  :req.body.room_type,
	room_status : 'Available',
    status:req.body.status,
    charges : req.body.charges,
    created_by :req.decoded.id,
  });

  let promise = mRoom.save();

  promise.then(function(doc){
    return res.status(201).json({message:"Room Successfully Added"});
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
  Rooms.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Room Updated Successfully',
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
	Rooms.dataTables({
    limit: req.body.length,
    skip: req.body.start,
	select : ('name charges room_status status updated_by'),
	populate : ('room_type'),
	//find:{ $or:[ {'status':'inactive'}, {'name':'farhan'} ]},
	//find:{'status':'active'},
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


exports.active = function(req, res) {
	
   
  Rooms.find({status:"active"}).select('name charges')
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

exports.available = function(req, res) {
	
   let response = [] ;

    RoomCategory.find({status:"active"}).select('name')
    .exec().then(docs => {
        return docs;
      }).then(docs => {

        (async function(){
        
        for ( let i = 0; i < docs.length; i++) {

          let dta = docs[i];
          // console.log(i);
          let cat_id = dta._id;
          let roomData = await Rooms.find({status:"active",room_status:"Available",room_type:cat_id}).select('name charges');
         // console.log(cat_id);

          let temp = [];

          roomData.forEach(function(d){

              let tem = {
                id : d._id,
                text : d.name+' / '+d.charges+' Per Day',
              }

              temp.push(tem);
            })




            let feed = {
              id : i,
              text : dta.name,
              children: temp,
            }

            response.push(feed);



        }
        res.status(200).json(response);
       


      })();
  
        


        


      })
      .catch(err => {
        console.log(err);
        res.status(501).json({
          error: err
        });
      });


    

  

    

};

