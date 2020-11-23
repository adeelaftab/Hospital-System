var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var mongooseHistory = require('mongoose-history')
var Schema = mongoose.Schema;

var schema = new Schema({
    name : {type:String, required:true,unique:true},
    status: {type:String,required:true},
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
schema.plugin(mongooseHistory)

module.exports = mongoose.model('Specialization',schema);