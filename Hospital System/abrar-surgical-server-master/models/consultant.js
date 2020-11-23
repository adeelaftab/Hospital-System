var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var mongooseHistory = require('mongoose-history')
var Schema = mongoose.Schema;

var schema = new Schema({
    name : {type:String, required:true,unique:true},
    address : {type:String},
    email : {type:String},
    office_no : {type:String},
    mobile_no : {type:String},
    consultant_type: {
      type: [
        'String'
      ]
    },
    specialization: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Specialization' }],
    charges: {
      first_time: {type:String},
	  first_time_hospital_share: {type:String},
      normal: {type:Number, required:true,min: 0},
	  normal_hospital_share: {type:Number, required:true,min: 0},
      seven_days: {type:String},
	  seven_days_hospital_share: {type:String},
      
  },
	hospital_share : {type:Number,min: 0},
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
schema.plugin(mongooseHistory)

module.exports = mongoose.model('Consultant',schema);