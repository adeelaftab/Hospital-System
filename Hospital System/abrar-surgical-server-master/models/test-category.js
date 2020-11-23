var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var mongooseHistory = require('mongoose-history')
var Schema = mongoose.Schema;

var schema = new Schema({
    category_name : {type:String, required:true,unique:true},
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
schema.plugin(uniqueValidator,{ message: 'Error, {VALUE} already be taken' });
schema.plugin(mongooseHistory)

module.exports = mongoose.model('TestCategory',schema);