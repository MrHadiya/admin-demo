const passport = require('passport')
const HTTP = require("../../constants/responseCode.constant");
var ObjectId = require('mongoose').Types.ObjectId;


//admin authorization
function authAdmin(req, res, next) {
    passport.authenticate('jwt', { session: false }, async function (err, userData, info, status) {
        try {
            if (err) return next(err)
            const { user } = userData
            if (!user || user.role !== "admin") return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate your-self', data: {} });

            //if user blocked
            if (user && user.active === false) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_ALLOWED, 'message': 'Your Account is De-activated!', data: {} })
            req.user = user
            return next()
        } catch (e) {
            console.log("error from admin middleware", e);
            return next()
        }
    })(req, res, next);
}



module.exports = {
    authAdmin
}