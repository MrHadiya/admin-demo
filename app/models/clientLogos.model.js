const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientLogosSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: null,
        trim: true
    }

}, { timestamps: true })

module.exports = mongoose.model('ClientLogos', clientLogosSchema)
