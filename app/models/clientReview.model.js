const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientReviewSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
    },
    text: {
        type: String,
        required: [true, "Taxt of review is required"],
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

module.exports = mongoose.model('ClientReview', clientReviewSchema)
