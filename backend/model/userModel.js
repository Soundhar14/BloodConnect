const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name : { type : String , required : true , unique  : true },
    userPhone : { type : String , required : true , unique : true },
    userEmail : { type : String , required : true, unique : true },
    userBloodGroup : { type : String , required : true },
    userGender : { type : String , required : true },
    userLocation : {type : String , required : true },
    lastDonationDate : {type : String , required : true },
    userPassword : { type : String , required : true },
    availability: {type: String, enum: ['available', 'unavailable'] , required: true },
    role: { type: String, enum: ['admin', 'donor'], default: 'donor' },
    resetToken: String,
    resetTokenExpiry: Date
}
,{ timestamps : true });

module.exports = mongoose.model('User' , userSchema);