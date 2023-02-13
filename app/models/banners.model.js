const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bannersSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    image: {
        type: String,
        default: null,
        trim: true
    },
    url: {
        type: String,
        default: null,
    },
    status: {
        type: Boolean,
        default: true
    },
    

}, { timestamps: true })

module.exports = mongoose.model('Banners', bannersSchema)
