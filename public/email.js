const AWS = require('aws-sdk');
const HTTP = require("../constants/responseCode.constant")
const awsConfig = {
   apiVersion: "2010-12-01",
   accessKeyId: process.env.AWS_ACCESS_KEY,
   secretAccessKey: process.env.AWS_SECRET_KEY,
   region: process.env.AWS_SES_REGION
}

const AWS_SES = new AWS.SES(awsConfig)


//Send verify email link
const sendVerifyEmail = (user, link) => {
   try {
      return res.status(HTTP.SUCCESS).send({ "status": true, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "send email!", data: {} })
   } catch (e) {
      console.log(e)
      return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Unable to send email!", data: {} })
   }
}


module.exports = {
   sendVerifyEmail,
}