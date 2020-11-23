var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;
var dataTables = require('mongoose-datatables')

var schema = new Schema({
	patient_id : {type:String},
    name : {type:String, required:true},
	relation : {type:String},
	age : {type:String},
	age_type : {type:String},
	blood_group : {type:String},
	cnic : {type:String},
	passport : {type:String},
	gender : {type:String,required:true},
	address: {
      city: {type:String},
      country: {type:String, required:true},
      location: {type:String},
      
  },
  contact: {
      mobile_no: {type:String ,required:true},
      whatsapp_no: {type:String},
      email: {type:String},
      
  },
  invoice: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }],
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
schema.plugin(dataTables)

module.exports = mongoose.model('Patient',schema);