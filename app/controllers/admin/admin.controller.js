const { User } = require('../../models/index')
const jwt = require('jsonwebtoken')
const HTTP = require("../../../constants/responseCode.constant");
const { hashSync, compareSync } = require('bcrypt');
const moment = require("moment");

var aws = require('aws-sdk');

var s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_S3_REGION
});



//Add default admin
async function deafultAdminsignup(req, res) {
    try {
        const adminData = { name: "admin", email: "admin@gmail.com", role: "admin" }
        const password = "Admin@123"

        const existsAdmin = await User.findOne({ email: adminData.email, role: adminData.role })
        //Admin exist 
        if (existsAdmin) return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.BAD_REQUEST, 'message': 'Success', data: {} })
        //create a default admin
        const userData = await new User({ ...adminData, password: hashSync(password.trim(), 10) }).save()

        if (!userData) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to add default admin', data: {} })
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.BAD_REQUEST, 'message': 'Success', data: {} })
    } catch (e) {
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!" })
    }
}


//admin login
async function adminLogin(req, res) {
    const { email, password } = req.body
    //validate request
    if (!email || !password) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'All fields are required', data: {} })
    try {
        const user = await User.findOne({ email: email })
        //user exists
        if (!user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Email is incorrect.', data: {} })
        //if user is not admin
        if (user.role !== "admin") return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Invalid credentials.', data: {} })
        //if user blocked
        if (user.active !== true) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Your Account is De-activated!', data: {} })
        //Incorrect password
        if (!compareSync(password, user.password)) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Password is incorrect.', data: {} })

        const payload = { email: user.email, id: user._id }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })

        return res.status(HTTP.SUCCESS).send({
            'status': true,
            'message': "Logged in successfully!",
            'code': HTTP.SUCCESS,
            'data': {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                },
                token: "Bearer " + token
            }
        })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!" })
    }
}

//profile
async function adminProfile(req, res) {
    try {
        if (!req.user) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate yourself.', data: {} })
        const user = await User.findById({ _id: req.user._id })
        if (!user) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "User not found!", data: {} })
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "User profile.", data: user })
    } catch (err) {
        console.log(err);
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}


module.exports = {
    adminLogin,

    deafultAdminsignup,
    adminProfile

}