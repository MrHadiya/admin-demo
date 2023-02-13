const { User, BlogsModel } = require('../../models/index')
const { uploadMaterialToAWS, uploadMaterialToLocal } = require('../../middlewares/upload')
const HTTP = require("../../../constants/responseCode.constant");
const randomstring = require("randomstring");
const moment = require("moment");
var ObjectId = require('mongoose').Types.ObjectId;

//======================== Manage Our Team =======================
async function addBlogs(req, res) {
    const { auth_name, category, title, form_title, mins, slug, tag, description, meta_desc, meta_key, detail_title, publish_date, publisher } = req.body
    if (!auth_name || !category || !title) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'All fields are required', data: {} })
    try {

        var blogImage = ""
        if (req.files && req.files.image) {
            var fileData = req.files.image;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'blogs/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) blogImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'blogs/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) blogImage = movetoAWS.data
            }
        } else {
            return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Please select valid Blog image.', data: {} })
        }

        var titleImage = ""
        if (req.files && req.files.title_img) {
            var fileData = req.files.title_img;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'blogs/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) titleImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'blogs/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) titleImage = movetoAWS.data
            }
        }


        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })
        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })
        const addData = {
            auth_name: auth_name,
            category: category,
            title: title,
            form_title: form_title,
            mins: mins,
            slug: slug,
            tag: tag,
            description: description,
            meta_desc: meta_desc,
            meta_key: meta_key,
            detail_title: detail_title,
            publish_date: publish_date,
            publisher: publisher,
            image: blogImage,
            title_img: titleImage,

        }

        const addFaqs = await new BlogsModel({ ...addData }).save()
        if (!addFaqs) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': '  to add Blogs.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Blogs added.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function editBlogs(req, res) {
    const { blog_id } = req.params
    const { auth_name, category, title, form_title, mins, slug, tag, description, meta_desc, meta_key, detail_title, publish_date, publisher } = req.body
    if (!auth_name || !category || !title) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'All fields are required', data: {} })

    try {
        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })
        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })

        var blogImage = ""
        if (req.files && req.files.image) {
            var fileData = req.files.image;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'blogs/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) blogImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'blogs/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) blogImage = movetoAWS.data
            }
        }

        var titleImage = ""
        if (req.files && req.files.title_img) {
            var fileData = req.files.title_img;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'blogs/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) titleImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'blogs/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) titleImage = movetoAWS.data
            }
        }


        const getBlog = await BlogsModel.findById({ _id: blog_id })
        if (!getBlog) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "Blog not found!", data: {} })
        console.log(getBlog);

        const addData = {
            auth_name: auth_name,
            category: category,
            title: title,
            form_title: form_title,
            mins: (mins) ? mins : getBlog.mins,
            slug: (slug) ? slug : getBlog.slug,
            tag: (tag) ? tag : getBlog.tag,
            description: (description) ? description : getBlog.description,
            meta_desc: (meta_desc) ? meta_desc : getBlog.meta_desc,
            meta_key: (meta_key) ? meta_key : getBlog.meta_key,
            detail_title: (detail_title) ? detail_title : getBlog.detail_title,
            publish_date: (publish_date) ? publish_date : getBlog.publish_date,
            publisher: (publisher) ? publisher : getBlog.publisher,
            image: (req.files && req.files.image) ? blogImage : getBlog.image,
            title_img: (req.files && req.files.title_img) ? titleImage : getBlog.title_img,

        }

        const editData = await BlogsModel.findOneAndUpdate({ _id: blog_id, status: true }, addData, { new: true })
        if (!editData) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'Faq not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Blog detail updated.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function getBlogs(req, res) {
    try {
        const getData = await BlogsModel.find({ status: true }).sort({ "_id": -1 })
        if (!getData) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'Blog not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Blog loadded successfully.", data: getData })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function deleteBlogs(req, res) {
    try {
        const { blog_id } = req.params
        const delData = await BlogsModel.findOneAndUpdate({ _id: blog_id, status: true }, { status: false }, { new: true })
        if (!delData) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "Blog not found!", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Blog deleted.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}


module.exports = {
    addBlogs,
    editBlogs,
    getBlogs,
    deleteBlogs,
}