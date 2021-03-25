const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModel = new Schema({
    roles : {
        type: Schema.Types.ObjectId,
        ref: "Role"
    },
    email: {
        type: String
    },
    verify:{
        type: Boolean,
        default: false, 
    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/300'
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
})

const user = mongoose.model('User', UserModel);
module.exports = user;