const { User, aboutUs, Banners, Companies } = require('../../models/index')
const { uploadMaterialToAWS, uploadMaterialToLocal } = require('../../middlewares/upload')
const HTTP = require("../../../constants/responseCode.constant");
const randomstring = require("randomstring");
const moment = require("moment");
var ObjectId = require('mongoose').Types.ObjectId;

//======================== Manage Client Reviews =======================

async function addAboutUs(req, res) {
    const { our_mission, our_vision } = req.body
    if (!our_mission || !our_vision) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'All fields are required', data: {} })
    try {
        var ourVisionImage = ""
        if (req.files && req.files.our_vision_image) {
            var fileData = req.files.our_vision_image;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'web-setting/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) ourVisionImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'web-setting/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) ourVisionImage = movetoAWS.data
            }
        } else {
            return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Please select valid our vision image.', data: {} })
        }
        var ourMissionImage = ""
        if (req.files && req.files.our_mission_image) {
            var fileData = req.files.our_mission_image;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'web-setting/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) ourMissionImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'web-setting/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) ourMissionImage = movetoAWS.data
            }
        } else {
            return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Please select valid our mission image.', data: {} })
        }

        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })

        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })
        const addData = { our_mission: our_mission, our_vision: our_vision, our_vision_image: ourVisionImage, our_mission_image: ourMissionImage }

        const getExistData = await aboutUs.find()
        var addAboutUs = []
        if (getExistData.length != 0) {
            addAboutUs = await aboutUs.findOneAndUpdate({ _id: getExistData[0]._id, status: true }, addData, { new: true })
            if (!addAboutUs) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to add client logos.', data: {} })
        } else {
            addAboutUs = await new aboutUs({ ...addData }).save()
            if (!addAboutUs) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to add client logos.', data: {} })
        }

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "About Us added.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function getAboutUs(req, res) {
    try {
        const aboutUsData = await aboutUs.find()
        if (!aboutUsData) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'About Us not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "About Us get successfully.", data: aboutUsData[0] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}


async function addBanners(req, res) {
    const { title, url } = req.body
    if (!title) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Banner title are required', data: {} })
    try {

        var bannerImage = ""
        if (req.files && req.files.image) {
            var fileData = req.files.image;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'banner-image/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) bannerImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'banner-image/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) bannerImage = movetoAWS.data
            }
        } else {
            return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Please select valid Banner image.', data: {} })
        }

        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })
        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })
        const addData = { title: title, url: url, image: bannerImage }

        const addBanner = await new Banners({ ...addData }).save()
        if (!addBanner) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to add Banner.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Banner added.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function editBanners(req, res) {
    const { banner_id } = req.params
    const { title, url } = req.body
    if (!banner_id || !ObjectId.isValid(banner_id)) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Please provide valid banner id.', data: {} })

    if (!title) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Title are required', data: {} })
    try {

        var bannerImage = ""
        if (req.files && req.files.image) {
            var fileData = req.files.image;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'banner-image/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) bannerImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'banner-image/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) bannerImage = movetoAWS.data
            }
        }

        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })
        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })

        const addData = { title: title, url: url }
        if (req.files && req.files.image && bannerImage != '') addData.image = bannerImage

        const editData = await Banners.findOneAndUpdate({ _id: banner_id, status: true }, addData, { new: true })
        if (!editData) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'Banner not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Banner detail updated.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function getBanners(req, res) {
    try {
        const getData = await Banners.find({ status: true }).sort({ "_id": -1 })
        if (!getData) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'Banner not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "banners loadded successfully.", data: getData })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function deleteBanners(req, res) {
    try {
        const { banner_id } = req.params
        const delData = await Banners.findOneAndUpdate({ _id: banner_id, status: true }, { status: false }, { new: true })
        if (!delData) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "Banner not found!", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Banner deleted.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}




async function addCompanySetting(req, res) {
    const { name, description, facebook, instagram, linkedin, twitter, address, email, phone, copyright } = req.body
    if (!name) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'All fields are required', data: {} })
    try {
        var logoImage = ""
        if (req.files && req.files.logo) {
            var fileData = req.files.logo;
            if (process.env.FILE_UPLOAD == 'LOCAL') {
                const movetoLocal = await uploadMaterialToLocal(fileData, 'web-setting/');
                if (!movetoLocal.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoLocal.message, data: {} })
                if (movetoLocal.data) logoImage = movetoLocal.data
            } else {
                const movetoAWS = await uploadMaterialToAWS(fileData, 'web-setting/');
                if (!movetoAWS.status) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': movetoAWS.message, data: {} })
                if (movetoAWS.data) logoImage = movetoAWS.data
            }
        }

        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })

        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })


        const getExistData = await Companies.find()
        var adddedData = []
        if (getExistData.length != 0) {
            const existCompny = getExistData[0]
            existCompny.name = (name) ? name : existCompny.name
            existCompny.description = (description) ? description : existCompny.description
            existCompny.facebook = (facebook) ? facebook : existCompny.facebook
            existCompny.instagram = (instagram) ? instagram : existCompny.instagram
            existCompny.linkedin = (linkedin) ? linkedin : existCompny.linkedin
            existCompny.twitter = (twitter) ? twitter : existCompny.twitter
            existCompny.address = (address) ? address : existCompny.address
            existCompny.email = (email) ? email : existCompny.email
            existCompny.phone = (phone) ? phone : existCompny.phone
            existCompny.copyright = (copyright) ? copyright : existCompny.copyright
            existCompny.logo = (req.files && req.files.logo) ? logoImage : existCompny.logo

            adddedData = await Companies.findOneAndUpdate({ _id: getExistData[0]._id, status: true }, existCompny, { new: true })
            if (!adddedData) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to add company setting.', data: {} })
        } else {
            const addData = { name: name }
            addData.description = description
            addData.facebook = facebook
            addData.instagram = instagram
            addData.linkedin = linkedin
            addData.twitter = twitter
            addData.address = address
            addData.email = email
            addData.phone = phone
            addData.copyright = copyright
            addData.logo = logoImage

            adddedData = await new Companies({ ...addData }).save()
            if (!adddedData) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to add company setting.', data: {} })
        }

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Company setting added.", data: [] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function getCompanySetting(req, res) {
    try {
        const getData = await Companies.find()
        if (!getData) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'company setting not found.', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Company setting get successfully.", data: getData[0] })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}




module.exports = {
    addAboutUs,
    getAboutUs,
    addBanners,
    editBanners,
    deleteBanners,
    getBanners,
    addCompanySetting,
    getCompanySetting
}