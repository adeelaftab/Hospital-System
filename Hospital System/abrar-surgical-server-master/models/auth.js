var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var schema = new Schema({
    first_name : {type:String, required:true},
    last_name: {type:String,required:false},
    username : {type:String,required:true,unique:true},
    email : {type:String,required:false,unique:true},
    password:{type:String, required:true},
    status : {type:String},
});

schema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password,10);
}

schema.methods.isValid = function(hashedpassword){
    return  bcrypt.compareSync(hashedpassword, this.password);
}

module.exports = mongoose.model('User',schema);