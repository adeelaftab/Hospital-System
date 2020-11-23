var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var mongooseHistory = require('mongoose-history')
var Schema = mongoose.Schema;

var schema = new Schema({
	invoice_id : {type:String},
	info: {
		description : {type:String,default:''},
      
  },
  charges: [
	{
	date_time : { type : Date, default: Date.now },
	category : {type:String},
	charges_category : {type:String},
	name : {type:String},
	original_charge : {type:String},
	charge : {type:String},
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
	daily_charges_id : {type: mongoose.Schema.Types.ObjectId, ref: 'DailyCharge'},
	room : {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
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
	advanced : {type:Number,default:0},
	pay : {type:Number,default:0},
	remaining : {type:Number,default:0},
	refund : {type:Number,default:0},
	status : {type:String}

},
	consultant_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Consultant'},
	room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
	patient_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
	discharge_status : {type:Boolean,default:false},
	discharge_on : { type : Date, default: Date.now },
    status: {type:String,required:true},
	next_charges_apply : { type : Date, default: Date.now },

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

module.exports = mongoose.model('Indoor',schema);