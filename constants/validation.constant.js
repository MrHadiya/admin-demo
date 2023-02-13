const { body, param, query } = require('express-validator');
var ObjectId = require('mongoose').Types.ObjectId;
const moment = require("moment")

module.exports = {
    NAME: body('name').trim().notEmpty().withMessage('Name is required!').bail(),
    EMAIL: body('email').trim().notEmpty().withMessage('Email is required!').bail().isEmail().withMessage('Email format is invalid!'),
    GOOGLE_ID: body('google_id').trim().notEmpty().withMessage('Google key required!').bail(),
    PASSWORD: body('password').trim().notEmpty().withMessage('password is required!').bail()
        .isLength({ min: 8, max: 16 }).withMessage('Password must be at least 8 characters [8-16]').bail()
    // .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).withMessage('Password should contain atleast one Alphabate,one Number and one Special character')
    ,
    CONFIRMPASSWORD: body('confirmPassword').trim().notEmpty().withMessage('Confrim password is required!').bail()
        .isLength({ min: 8, max: 16 }).withMessage('Confirm password must be at least 8 characters [8-16]').bail()
    // .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).withMessage('Confirm password should contain atleast one Alphabate,one Number and one Special character')
    ,
    CURRENTPASSWORD: body('currentPassword').trim().notEmpty().withMessage('Current password is required!').bail()
        .isLength({ min: 8, max: 16 }).withMessage('Confirm password must be at least 8 characters [8-16]').bail()
    // .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).withMessage('Confirm password should contain atleast one Alphabate,one Number and one Special character')
    ,
    USERID: param('id').trim().notEmpty().withMessage('User id is required!').bail(),
    TOKEN: param('token').trim().notEmpty().withMessage('Token is required!').bail(),
    DESCRIPTION: body('description').trim().notEmpty().withMessage('Description is required!').bail(),
    OBJECTID: param('id').trim().notEmpty().withMessage('Please provide object id!').bail().custom((value) => {
        if (!ObjectId.isValid(value)) {
            throw new Error('Please provide valid object id.');
        }
        return true;
    }).bail(),
    PHNO: body('phno').trim().notEmpty().withMessage('Phone number is required!').bail(),
    ADDRESS: body('address').trim().notEmpty().withMessage('Address is required!').bail(),
    STARTDATE: query('startDate').trim().notEmpty().withMessage('Start Date is required!').bail().custom((value) => {
        const startDate = moment(value, 'MM-DD-YYYY', true);
        if (!startDate.isValid()) {
            throw new Error('Invalid start date format. It should be in MM-DD-YYYY format.');
        }
        return true;
    }).bail(),
    ENDDATE: query('endDate').trim().notEmpty().withMessage('End Date is required!').bail().custom((value) => {
        const endDate = moment(value, 'MM-DD-YYYY', true);
        if (!endDate.isValid()) {
            throw new Error('Invalid end date format. It should be in MM-DD-YYYY format.');
        }
        return true;
    }).bail(),
    QUESTION: body('question').trim().notEmpty().withMessage('Question is required!').bail(),
    ANSWER: body('answer').trim().notEmpty().withMessage('Answer is required!').bail(),
    ISACTIVE: body('isActive').trim().notEmpty().withMessage('Question status is required!').bail().isBoolean().withMessage('Question status must be TRUE or FALSE!').bail(),
    SUBJECT: body('subject').trim().notEmpty().withMessage('Subject is required!').bail(),
    CONTENT: body('content').trim().notEmpty().withMessage('Content is required!').bail(),
    COMPANYNAME: body('companyName').trim().notEmpty().withMessage('Company name is required!').bail(),
    MESSAGE: body('message').trim().notEmpty().withMessage('Message is required!').bail(),
    RATING: body('rating').trim().notEmpty().withMessage('Rating is required!').bail(),
    TEXT: body('text').trim().notEmpty().withMessage('Review text is required!').bail(),
    REVIEW_ID: param('review_id').trim().notEmpty().withMessage('Review id is required!').bail(),
    LOGO_ID: param('logo_id').trim().notEmpty().withMessage('Logo id is required!').bail(),
    MEMBER_ID: param('member_id').trim().notEmpty().withMessage('Member id is required!').bail(),
    FAQ_ID: param('faq_id').trim().notEmpty().withMessage('Faq id is required!').bail(),
    BANNER_ID: param('banner_id').trim().notEmpty().withMessage('Banner id is required!').bail(),
    BLOG_ID: param('blog_id').trim().notEmpty().withMessage('Blog id is required!').bail(),
    OUR_MISSION: body('our_mission').trim().notEmpty().withMessage('Our mission is required!').bail(),
    OUR_VISION: body('our_vision').trim().notEmpty().withMessage('Our vision is required!').bail(),
    POSITION: body('position').trim().notEmpty().withMessage('Position is required!').bail(),
    TITLE: body('title').trim().notEmpty().withMessage('Title is required!').bail(),
    TITLE: body('form_title').trim().notEmpty().withMessage('Title is required!').bail(),
    AUTH_NAME: body('auth_name').trim().notEmpty().withMessage('Auth name is required!').bail(),
    CATEGORY: body('category').trim().notEmpty().withMessage('Category is required!').bail(),
   
}