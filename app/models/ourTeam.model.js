const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ourTeamSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    position: {
        type: String,
        required: [true, "Position is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    twitter: {
        type: String,
        default: null,
    },
    linkedin: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },
    

}, { timestamps: true })

module.exports = mongoose.model('OurTeam', ourTeamSchema)
