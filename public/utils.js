const { validationResult } = require('express-validator');
const HTTP = require('../constants/responseCode.constant')
const jwt = require('jsonwebtoken')
const { User, AdminSession, UserSession, Subscription, FileFormat } = require('../app/models/index')


function validateReq(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errMsg = errors.errors.map(err => err.msg)
        if (errMsg && errMsg.length > 0) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": errMsg[0], data: {} })
    } else {
        return next()
    }
}

module.exports = {
    validateReq
}