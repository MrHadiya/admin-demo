const mongoose = require('mongoose')
const Schema = mongoose.Schema

const aboutUsSchema = new Schema({
    our_mission: {
        type: String,
        required: [true, "Our Mission is required"],
        trim: true,
        
    },
    our_vision: {
        type: String,
        required: [true, "Our Vision is required"],
        trim: true,
    },
    our_mission_image: {
        type: String,
        default: null,
        trim: true
    },
    our_vision_image: {
        type: String,
        default: null,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },

}, { timestamps: true })

module.exports = mongoose.model('AboutUs', aboutUsSchema)
