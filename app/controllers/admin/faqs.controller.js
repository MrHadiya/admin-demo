const { User, faqsModel } = require('../../models/index')
const { uploadMaterialToAWS, uploadMaterialToLocal } = require('../../middlewares/upload')
const HTTP = require("../../../constants/responseCode.constant");
const randomstring = require("randomstring");
const moment = require("moment");
var ObjectId = require('mongoose').Types.ObjectId;

//======================== Manage Our Team =======================
async function addFaqs(req, res) {
    const { question, answer } = req.body
    if (!question || !answer) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'All fields are required', data: {} })
    try {

        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })
        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })
        const addData = { question: question, answer: answer }

        const addFaqs = await new faqsModel({ ...addData }).save()
        if (!addFaqs) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to add faq.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Faq added.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function editFaqs(req, res) {
    const { faq_id } = req.params
    const { question, answer, } = req.body
    if (!faq_id || !ObjectId.isValid(faq_id)) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Please provide valid member id.', data: {} })

    if (!question || !answer) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'All fields are required', data: {} })
    try {
        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })
        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })
        const addData = { question: question, answer: answer }


        const editFaqs = await faqsModel.findOneAndUpdate({ _id: faq_id, status: true }, addData, { new: true })
        if (!editFaqs) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'Faq not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Faq detail updated.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function getFaqs(req, res) {
    try {
        const getFaqs = await faqsModel.find({ status: true }).sort({ "_id": -1 })
        if (!getFaqs) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'Faqs not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Faqs loadded successfully.", data: getFaqs })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function deleteFaqs(req, res) {
    try {
        const { faq_id } = req.params
        const delFaqs = await faqsModel.findOneAndUpdate({ _id: faq_id, status: true }, { status: false }, { new: true })
        if (!delFaqs) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "Faqs not found!", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Faqs deleted.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}


module.exports = {
    addFaqs,
    editFaqs,
    getFaqs,
    deleteFaqs,
}