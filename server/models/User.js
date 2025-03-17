const mongoose = require('mongoose');

const Schema =  mongoose.Schema;
const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique:true
    },
    username: {
        type: String,
        required: true,
        unique:true
    },
    
    password: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        default:"user"
    },
    otp:{
        type:String
    },
    otpExpire:{
        type:Date
    }
});

module.exports = mongoose.model('User', UserSchema);