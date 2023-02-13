const { User, ourTeam } = require('../../models/index')
const { uploadMaterialToAWS, uploadMaterialToLocal } = require('../../middlewares/upload')
const HTTP = require("../../../constants/responseCode.constant");
const randomstring = require("randomstring");
const moment = require("moment");
var ObjectId = require('mongoose').Types.ObjectId;

//======================== Manage Our Team =======================
async function addOurTeam(req, res) {
    const { name, position, description, twitter, linkedin } = req.body
    if (!name || !position || !description) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'All fields are required', data: {} })
    try {
        var teamImage = ""
        if (req.files && req.files.image) {
            var fileData = req.files.image;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'our-team/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) teamImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'our-team/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) teamImage = movetoAWS.data
            }
        }

        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })
        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })
        const addData = { name: name, position: position, description: description, image: teamImage, twitter: twitter, linkedin: linkedin }

        const addReview = await new ourTeam({ ...addData }).save()
        if (!addReview) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to add member in team.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Team member added.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function editOurTeam(req, res) {
    const { member_id } = req.params
    const { name, position, description, twitter, linkedin } = req.body
    if (!member_id || !ObjectId.isValid(member_id)) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Please provide valid member id.', data: {} })

    if (!name || !position || !description) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'All fields are required', data: {} })
    try {
        var teamImage = ""
        if (req.files && req.files.image) {
            var fileData = req.files.image;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'our-team/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) teamImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'our-team/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) teamImage = movetoAWS.data
            }
        }

        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })
        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })
        const addData = { name: name, position: position, description: description, twitter: twitter, linkedin: linkedin }
        if (req.files && req.files.image) addData.image = teamImage

        const ourTeams = await ourTeam.findOneAndUpdate({ _id: member_id , status: true}, addData, { new: true })
        if (!ourTeams) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'User not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Team member detail updated.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function getOurTeam(req, res) {
    try {
        const ourTeams = await ourTeam.find({ status: true }).sort({ "_id": -1 })
        if (!ourTeams) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'User not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Team member loadded successfully.", data: ourTeams })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function deleteOurTeam(req, res) {
    try {
        const { member_id } = req.params
        const ourTeams = await ourTeam.findOneAndUpdate({ _id: member_id, status: true }, { status: false }, { new: true })
        if (!ourTeams) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Team member deleted.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}


module.exports = {
    addOurTeam,
    editOurTeam,
    getOurTeam,
    deleteOurTeam,
}