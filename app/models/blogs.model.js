const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogsSchema = new Schema({
    auth_name: {
        type: String,
        required: [true, "Author name is required"],
    },
    category: {
        type: String,
        required: [true, "category is required"],
    },
    title: {
        type: String,
        required: [true, "Blog Title is required"],
    },
    form_title: {
        type: String,
        default: null,
    },
    mins: {
        type: Number,
        default: 0,
    },
    slug: {
        type: String,
        default: null,
    },
    tag: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    meta_desc: {
        type: String,
        default: null,
    },
    meta_key: {
        type: String,
        default: null,
    },
    detail_title: {
        type: String,
        default: null,
    },
    publish_date: {
        type: Date,
        default: null,
    },
    publisher: {
        type: String,
        default: null,
    },
    title_img: {
        type: String,
        default: null,
        trim: true
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

module.exports = mongoose.model('Blogs', blogsSchema)
