var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var mongooseHistory = require('mongoose-history')
var Schema = mongoose.Schema;
var dataTables = require('mongoose-datatables')
var schema = new Schema({
	invoice_id : {type:String},
	info: {
		bp: {type:String,default:''},
		pulse: {type:String,default:''},
		temp: {type:String,default:''},
		weight: {type:String,default:''},
		description : {type:String,default:''},
      
  },
	charges: [
	{
	category : {type:String},
	name : {type:String},
	charge : {type:String},
	consultant_charge_type : {type:String},
	discount : {type:String},
	total : {type:String},
	description : {type:String},
	created_by : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	updated_by : {
      type:mongoose.Schema.Types.ObjectId,
      ref : "User",
      required:false
    },
	discount_given_by : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	charges_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Charge'},
	consultant_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Consultant'},
	status : {type:String},
	refund  : {type:Boolean,default:false},
	refund_by  : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		
	} 
  ],
  invoice : {
	  
	consultant_amount : {type:Number,default:0},
	hospital_amount : {type:Number,default:0},
	charges: {type:Number,default:0},
	discount : {type:Number,default:0},
	grand_total : {type:Number,default:0},
	pay : {type:Number,default:0},
	remaining : {type:Number,default:0},
	refund : {type:Number,default:0},
	status : {type:String}

},
	patient_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
    status: {type:String,required:true},
    created_by : {
      type:mongoose.Schema.Types.ObjectId,
      ref : "User",
      required:true
    },
    updated_by : {
      type:mongoose.Schema.Types.ObjectId,
      ref : "User",
      required:false
    },
});
schema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
//schema.plugin(mongooseHistory)
schema.plugin(dataTables)

module.exports = mongoose.model('Outdoor',schema);