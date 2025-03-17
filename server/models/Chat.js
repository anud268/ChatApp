const mongoose = require('mongoose');

const Schema =  mongoose.Schema;
const ChatSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true 
    },
    timeStamp:{
        type:Date,
        default:Date.now
    }
}
);

module.exports = mongoose.model('Chat', ChatSchema);

