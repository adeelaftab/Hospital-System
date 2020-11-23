var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var mongooseHistory = require('mongoose-history')
var dataTables = require('mongoose-datatables')
var schema = new mongoose.Schema({
    name : {
      type:String, 
      required:true,
      unique:true
    },
    room_type  : {
      type:mongoose.Schema.Types.ObjectId,
      ref : "RoomType",
      required:true
    },
    charges  : {
      type:Number,
      required:true,
      min: 0
    },
	room_status : {
		 type:String,
		required:true
	},
	indoor  : {
      type:mongoose.Schema.Types.ObjectId,
      ref : "Indoor",
      required:false
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
schema.plugin(dataTables)
module.exports = mongoose.model('Room',schema);