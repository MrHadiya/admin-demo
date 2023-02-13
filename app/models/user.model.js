const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        default: 'user',
        trim: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    avatar: {
        type: String,
        default: null,
        trim: true
    }

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
