var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var mongooseHistory = require('mongoose-history')
var Schema = mongoose.Schema;
var dataTables = require('mongoose-datatables')
var schema = new Schema({
	expense_id : {type:String, required:true},
    amount : {type:Number, required:true},
	note : {type:String, required:false},
	category : {
      type:mongoose.Schema.Types.ObjectId,
      ref : "ExpenseCategory",
      required:true
    },
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
schema.plugin(dataTables)
module.exports = mongoose.model('Expense',schema);