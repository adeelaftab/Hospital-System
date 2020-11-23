const Charges = require('../models/charges');
const Patient = require('../models/patient');
//const ChargesCategory = require('../models/charges-category');
const { check, validationResult } = require('express-validator/check');
const Outdoor = require('../models/outdoor');
const Indoor = require('../models/indoor');
const Expense = require('../models/expense');
const Rooms = require('../models/room');
const DailyCharges = require('../models/daily-charges');
const request = require('request');
var fs = require('fs');



exports.detail = async function(req, res) {
	
	let from = req.body.from;
	let to = req.body.to;
	
	let startOf = new Date(from.year,from.month-1,from.day,1,0,0);
	let endOf = new Date(to.year,to.month-1,to.day+1,0,59,59);
	console.log("Start Of"+startOf+"..."+"End Of"+endOf);
	
	let outdoor = await Outdoor.find({ status: 'active',"created_at": {"$gte": startOf, "$lt": endOf} })
	.select('invoice_id patient_id invoice charges.consultant_id created_at')
	.populate('patient_id charges.consultant_id','name');
	
	let indoor = await Indoor.find({ status: 'active',discharge_status:true,$or:[ 
		{ "created_at": {"$gte": startOf, "$lt": endOf }},{"discharge_on": {"$gte": startOf, "$lt": endOf }}  
     ]})
	.select('invoice_id patient_id created_at discharge_on invoice consultant_id')
	.populate('patient_id consultant_id','name');
	
	
	let active_indoor = await Indoor.find({ status: 'active',discharge_status:false})
	.select('invoice_id created_at patient_id invoice consultant_id')
	.populate('patient_id consultant_id room','name');
	
	let expense = await Expense.find({ status: 'active',"created_at": {"$gte": startOf, "$lt": endOf} })
	.select('expense_id amount note created_by created_at category')
	.populate('category created_by','category_name first_name');
	

	
	return res.status(201).json({
		outdoor: outdoor,
		indoor : indoor,
		active_indoor : active_indoor,
		expense : expense
	});
	
  
 

};