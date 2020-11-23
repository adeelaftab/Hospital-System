const Auth = require('../models/auth');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const config = require('../config');
exports.validate = (method) => {
switch (method) {
    case 'register': {
     return [ 
      check('first_name', 'First name is required').not().isEmpty(),
      check('username', 'Username is required').not().isEmpty()
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            Auth.findOne({ 'username': value }, (err, resp) => {
               if(resp !== null) {
                  return reject();
               } else {
                  return resolve();
               }
            });
			});
			}).withMessage((value) => {
			return (value+' is already taken');
    }),
    check('email', 'Email is required').not().isEmpty().isEmail()
		  .custom((value, { req }) => {
         return new Promise((resolve, reject) => {
            Auth.findOne({ 'email': value }, (err, resp) => {
               if(resp !== null) {
                  return reject();
               } else {
                  return resolve();
               }
            });
			});
			}).withMessage((value) => {
			return (value+' is already taken');
		}),
        check('status').not().isEmpty().withMessage('Status required').isIn(['active', 'inactive']).withMessage('Incorrect status value'),
        check('password', 'Password is required').not().isEmpty()
       ]   
    }
    case 'login': {
      return [ 
       check('username', 'Username is required').not().isEmpty(),
       check('password', 'Password is required').not().isEmpty(),
        ]   
     }
  }
}


exports.register = function(req,res)
{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var user = new Auth ({
    first_name : req.body.first_name,
    last_name :req.body.last_name,
    username : req.body.username,
    email: req.body.email,
    password: Auth.hashPassword(req.body.password),
  });

  let promise = user.save();

  promise.then(function(doc){
    return res.status(201).json(doc);
  })

  promise.catch(function(err){
    return res.status(500).json(err)
  })
}

exports.login = function(req,res)
{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let promise = Auth.findOne({username:req.body.username}).exec();

  promise.then(function(doc){
   if(doc) {
     if(doc.isValid(req.body.password)){
         // generate token
         let token = jwt.sign({id:doc.id,username:doc.username,first_name:doc.first_name,last_name:doc.last_name},config.secret,{expiresIn : '24h'});

         return res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });

     } else {
       return  res.status(403).json({
        success: false,
        message: 'Incorrect username or password'
      });
     }
   }
   else {
     return res.status(400).json({
      success: false,
      message: 'Authentication failed! User Not Register'
    });
   }
  });

  promise.catch(function(err){
    return res.status(501).json({message:'Some internal error'});
  })
}