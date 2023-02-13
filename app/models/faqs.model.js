const mongoose = require('mongoose')
const Schema = mongoose.Schema

const faqsSchema = new Schema({
    question: {
        type: String,
        required: [true, "Question is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
    },
    status: {
        type: Boolean,
        default: true
    },
    

}, { timestamps: true })

module.exports = mongoose.model('Faqs', faqsSchema)
