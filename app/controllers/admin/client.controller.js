const { User, clientReview, clientLogos } = require('../../models/index')
const { uploadMaterialToAWS, uploadMaterialToLocal } = require('../../middlewares/upload')
const HTTP = require("../../../constants/responseCode.constant");
const randomstring = require("randomstring");
const moment = require("moment");
var ObjectId = require('mongoose').Types.ObjectId;

//======================== Manage Client Reviews =======================
async function addClientReview(req, res) {
    const { name, rating, text } = req.body
    if (!name || !rating || !text) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'All fields are required', data: {} })
    try {
        var clientImage = ""
        if (req.files && req.files.image) {
            var fileData = req.files.image;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'client/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) clientImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'client/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) clientImage = movetoAWS.data
            }
        }

        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })
        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })
        const addData = { name: name, rating: rating, text: text, image: clientImage }

        const addReview = await new clientReview({ ...addData }).save()
        if (!addReview) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to add client review.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Client review added.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function editClientReview(req, res) {
    const { review_id } = req.params
    const { name, rating, text } = req.body
    if (!review_id || !ObjectId.isValid(review_id)) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Please provide valid review.', data: {} })

    if (!name || !rating || !text) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'All fields are required', data: {} })
    try {
        var clientImage = ""
        if (req.files && req.files.image) {
            var fileData = req.files.image;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'client/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) clientImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'client/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) clientImage = movetoAWS.data
            }
        }

        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })
        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })
        const addData = { name: name, rating: rating, text: text, image: clientImage }

        const clientReviews = await clientReview.findOneAndUpdate({ _id: review_id, status: true }, addData, { new: true })
        if (!clientReviews) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'Review not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Client review updated.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function getClientReview(req, res) {
    try {
        const clientReviews = await clientReview.find({ status: true }).sort({ "_id": -1 })
        if (!clientReviews) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'Review not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Client review get successfully.", data: clientReviews })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function deleteClientReview(req, res) {
    try {
        const { review_id } = req.params
        const clientReviews = await clientReview.findOneAndUpdate({ _id: review_id, status: true }, { status: false }, { new: true })
        if (!clientReviews) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User Review not found!", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Client review deleted.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

//======================== Manage Client logos =======================

async function addClientLogos(req, res) {
    const { name } = req.body
    if (!name) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'All fields are required', data: {} })
    try {
        var clientImage = ""
        if (req.files && req.files.image) {
            var fileData = req.files.image;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'client-logo/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) clientImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'client-logo/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) clientImage = movetoAWS.data
            }
        } else {
            return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Please select valid image.', data: {} })
        }

        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })

        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })
        const addData = { name: name, image: clientImage }

        const addReview = await new clientLogos({ ...addData }).save()
        if (!addReview) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to add client logos.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Client logo added.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function getclientLogos(req, res) {
    try {
        const clientLogo = await clientLogos.find({ status: true }).sort({ "_id": -1 })
        if (!clientLogo) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'Client logos not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Client logo get successfully.", data: clientLogo })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function deleteclientLogos(req, res) {
    try {
        const { logo_id } = req.params
        const clientLogo = await clientLogos.findOneAndUpdate({ _id: logo_id, status: true }, { status: false }, { new: true })
        if (!clientLogo) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "Client logo not found!", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Client logos deleted.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

module.exports = {
    addClientReview,
    editClientReview,
    getClientReview,
    deleteClientReview,
    addClientLogos,
    getclientLogos,
    deleteclientLogos
}