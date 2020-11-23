var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var mongooseHistory = require('mongoose-history')

var schema = new mongoose.Schema({
    test_name : {
      type:String, 
      required:true,
      unique:true
    },
    test_category  : {
      type:mongoose.Schema.Types.ObjectId,
      ref : "TestCategory",
      required:true
    },
    charges  : {
      type:Number,
      required:true,
      min: 0
    },
    status: {
      type:String,
      required:true
    },
    created_by : {
      type:String,
      ref : "User",
      required:true
    },
    updated_by : {
      type:String,
      ref : "User",
      required:false
    },
});
schema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
//schema.plugin(uniqueValidator,{ message: 'Error, {VALUE} already be taken' });
schema.plugin(mongooseHistory)

module.exports = mongoose.model('MedicalTest',schema);