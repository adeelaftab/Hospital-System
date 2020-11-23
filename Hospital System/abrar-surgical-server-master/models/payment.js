var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var mongooseHistory = require('mongoose-history')
var Schema = mongoose.Schema;

var schema = new Schema({
    invoice_type : {type:String, required:true},
	invoice_id: {type:mongoose.Schema.Types.ObjectId},
	patient_id : {type:mongoose.Schema.Types.ObjectId},
	payment_type : {type:String},
	amount : {type:Number},
	note : {type:String},
	paid_by : {type:String},
	status : {type:String},
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
schema.plugin(mongooseHistory)

module.exports = mongoose.model('Payment',schema);