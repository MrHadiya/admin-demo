const mongoose = require('mongoose')
const Schema = mongoose.Schema

const companySchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    description: {
        type: String,
        default: null,
    },
    facebook: {
        type: String,
        default: null,
    },
    instagram: {
        type: String,
        default: null,
    },
    linkedin: {
        type: String,
        default: null,
    },
    twitter: {
        type: String,
        default: null,
    },
    address: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
        lowercase: true,
    },
    phone: {
        type: String,
        default: null,
    },
    copyright: {
        type: String,
        default: null,
    },
    logo: {
        type: String,
        default: null,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },

}, { timestamps: true })

module.exports = mongoose.model('Companies', companySchema)
